const timersPromises = require("timers/promises");
const setupSchema = require("./setupSchema");
const validateAgainstSchema = require("./schema/validateAgainstSchema");
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
    currentInterval: 10000,
  };
};

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

  const queue = await state.insertQueueBackend.consume();

  if (queue.length == 0) {
    state.isIdle = true;
  }

  for (const entry of queue) {
    console.log(`inserting row into BQ ${entry.table}`);

    console.log(entry);

    var filteredRow = await filterFieldsAccordingToEvent(
      entry.eventName,
      entry.row,
      config
    );

    var valid = await validateAgainstSchema(entry.table, filteredRow, config);

    if (!valid) {
      console.log("Not valid event against schema, ignoring event");
    } else {
      await config.bigquery
        .dataset(config.dataset)
        .table(entry.table)
        .insert([filteredRow]);
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
