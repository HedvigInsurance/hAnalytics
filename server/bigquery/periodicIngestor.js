const timersPromises = require("timers/promises");
const setupSchema = require("./setupSchema");
const validateAgainstSchema = require("./schema/validateAgainstSchema");
const insertDynamicFields = require("./schema/insertDynamicFields");
const filterFieldsAccordingToEvent = require("./schema/filterFieldsAccordingToEvent");

const createState = () => {
  var _schemaLoadedPromiseHandlers = {};
  var schemaLoaded = new Promise(function (resolve, reject) {
    _schemaLoadedPromiseHandlers = { resolve: resolve, reject: reject };
  });

  return {
    _schemaLoadedPromiseHandlers,
    insertQueueBackend: null,
    schemaLoaded: schemaLoaded,
    running: false,
    didStop: false,
    isIdle: false,
    droppedRowsErrors: [],
    currentInterval: 10000,
  };
};

const getSourceVersion = () =>
  process.env.SOURCE_VERSION || process.env.HEROKU_SLUG_COMMIT || "none";

const ingest = async (config, state) => {
  if (!state.insertQueueBackend) {
    console.error("!!! No queue backend !!!");
    return;
  }

  state.isIdle = false;
  state.didStop = false;

  if (!state.running) {
    console.log("Ingestion has been stopped");
    state.didStop = true;
    return;
  }

  if (!state.schemaLoaded) {
    console.log("Not inserting as schema hasn't loaded yet");
    await timersPromises.setTimeout(state.currentInterval / 10);
    await ingest(config, state);
    return;
  }

  const consumedQueue = await state.insertQueueBackend.consume();
  const queue = [];

  for (const entry of consumedQueue) {
    if (
      entry.skipOnSourceVersion &&
      entry.skipOnSourceVersion == getSourceVersion()
    ) {
      await state.insertQueueBackend.append(entry);
    } else {
      queue.push(entry);
    }
  }

  if (queue.length == 0) {
    state.isIdle = true;
  }

  for (const entry of queue) {
    const putBackIntoQueue = async (err) => {
      if (entry.currentRetries > 5) {
        console.log(
          "Dropping event as retries was too high, adding SOURCE_VERSION to potentially fix in future release",
          JSON.stringify(entry.row, null, 2)
        );
        state.droppedRowsErrors.push(err);

        const sourceVersionRetries = entry.sourceVersionRetires ?? 0;

        if (sourceVersionRetries < 5) {
          await state.insertQueueBackend.append({
            ...entry,
            skipOnSourceVersion: getSourceVersion(),
            sourceVersionRetires: sourceVersionRetries + 1,
            currentRetries: 0,
          });
        } else {
          console.log(
            "Event wasn't fixed in 5 different source versions, so we will skip processing this event completely",
            err
          );
        }
      } else {
        await state.insertQueueBackend.append({
          ...entry,
          currentRetries: (entry.currentRetries ?? 0) + 1,
        });
      }
    };

    console.log(`inserting row into BQ ${entry.table}`);

    const filteredRow = await filterFieldsAccordingToEvent(
      entry.table,
      entry.row,
      config
    );
    var valid;

    try {
      valid = await validateAgainstSchema(entry.table, filteredRow, config);
    } catch (err) {
      valid = false;
    }

    if (!valid) {
      console.log(
        "Not valid event against schema, trying to insert dynamic fields"
      );

      try {
        await insertDynamicFields(
          entry.table,
          entry.table,
          filteredRow,
          config
        );
        await putBackIntoQueue(new Error("not valid against schema"));
      } catch (err) {
        await putBackIntoQueue(err);
        console.error("Failed to create dynamic fields", err);
      }
    } else {
      try {
        await config.bigquery
          .dataset(config.dataset)
          .table(entry.table)
          .insert([filteredRow]);
      } catch (err) {
        if (err.name == "PartialFailureError") {
          console.log(
            "Ignoring PartialFailureError we should be eventually consistent"
          );
        } else {
          await putBackIntoQueue(err);
        }
      }
    }
  }

  await timersPromises.setTimeout(state.currentInterval);
  await ingest(config, state);
};

module.exports = {
  addToQueue: (entry, state) => {
    state.insertQueueBackend?.append(entry);
  },
  start: (config, backend, interval = 10000) => {
    var state = createState();

    state.running = true;
    state.insertQueueBackend = backend;
    state.currentInterval = interval;

    setupSchema(() => {
      state._schemaLoadedPromiseHandlers.resolve();
    }, config);

    ingest(config, state);

    return state;
  },
  stop: async (state) => {
    state.running = false;

    return new Promise((resolve) => {
      var interval = setInterval(async () => {
        if (state.didStop) {
          clearInterval(interval);

          setTimeout(() => {
            resolve();
          }, 100);
        }
      }, state.currentInterval * 5);
    });
  },
  waitUntilIdle: async (state) => {
    state.isIdle = false;

    return new Promise((resolve) => {
      var interval = setInterval(() => {
        if (state.isIdle) {
          clearInterval(interval);
          resolve();
        }
      }, state.currentInterval * 5);
    });
  },
  consumeQueue: async (state) => state.insertQueueBackend.consume(),
};
