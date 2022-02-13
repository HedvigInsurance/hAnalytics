const timersPromises = require("timers/promises");
const setupSchema = require("./setupSchema");
const validateAgainstSchema = require("./schema/validateAgainstSchema");
const insertDynamicFields = require("./schema/insertDynamicFields");

var insertQueueBackend = null;
var schemaLoaded = false;
var running = false;
var didStop = false;
var isIdle = false;
var droppedRowsErrors = [];
var currentInterval = 10000;

const getSourceVersion = () =>
  process.env.SOURCE_VERSION || process.env.HEROKU_SLUG_COMMIT || "none";

const ingest = async (config) => {
  if (!insertQueueBackend) {
    console.error("!!! No queue backend !!!");
    return;
  }

  isIdle = false;
  didStop = false;

  if (!running) {
    console.log("Ingestion has been stopped");
    didStop = true;
    return;
  }

  if (!schemaLoaded) {
    console.log("Not inserting as schema hasn't loaded yet");
    await timersPromises.setTimeout(currentInterval / 10);
    await ingest(config);
    return;
  }

  const consumedQueue = await insertQueueBackend.consume();
  const queue = [];

  for (const entry of consumedQueue) {
    if (
      entry.skipOnSourceVersion &&
      entry.skipOnSourceVersion == getSourceVersion()
    ) {
      await insertQueueBackend.append(entry);
    } else {
      queue.push(entry);
    }
  }

  if (queue.length == 0) {
    isIdle = true;
  }

  for (const entry of queue) {
    const putBackIntoQueue = async (err) => {
      if (entry.currentRetries > 5) {
        console.log(
          "Dropping event as retries was too high, adding SOURCE_VERSION to potentially fix in future release"
        );
        droppedRowsErrors.push(err);

        const sourceVersionRetries = entry.sourceVersionRetires ?? 0;

        if (sourceVersionRetries < 5) {
          await insertQueueBackend.append({
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
        await insertQueueBackend.append({
          ...entry,
          currentRetries: (entry.currentRetries ?? 0) + 1,
        });
      }
    };

    console.log(`inserting row into BQ ${entry.table}`);

    const valid = await validateAgainstSchema(entry.table, entry.row, config);

    if (!valid) {
      console.log(
        "Not valid event against schema, trying to insert dynamic fields"
      );

      try {
        await insertDynamicFields(entry.table, entry.row, config);
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
          .insert([entry.row]);
      } catch (err) {
        console.error("Failed to insert into BQ", err);

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

  await timersPromises.setTimeout(currentInterval);
  await ingest(config);
};

module.exports = {
  addToQueue: (entry) => {
    insertQueueBackend?.append(entry);
  },
  start: (
    config,
    backend,
    interval = 10000,
    shouldSetupSchema = true,
    processOnSigterm = true
  ) => {
    running = true;
    insertQueueBackend = backend;
    currentInterval = interval;

    if (shouldSetupSchema) {
      setupSchema(() => {
        schemaLoaded = true;
      }, config);
    } else {
      schemaLoaded = true;
    }

    if (processOnSigterm) {
      process.on("SIGTERM", async () => {
        console.log("Processing before exiting");
        await ingest(config);
      });
    }

    return ingest(config);
  },
  stop: async () => {
    running = false;

    return new Promise((resolve) => {
      var interval = setInterval(async () => {
        if (didStop) {
          clearInterval(interval);

          setTimeout(() => {
            resolve();
          }, 100);
        }
      }, currentInterval * 5);
    });
  },
  waitUntilIdle: async () => {
    isIdle = false;

    return new Promise((resolve) => {
      var interval = setInterval(() => {
        if (isIdle) {
          clearInterval(interval);
          resolve();
        }
      }, currentInterval * 5);
    });
  },
  consumeQueue: async () => insertQueueBackend.consume(),
};
