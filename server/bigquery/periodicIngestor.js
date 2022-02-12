const timersPromises = require("timers/promises");
const setupSchema = require("./setupSchema");
const validateAgainstSchema = require("./schema/validateAgainstSchema");
const insertDynamicFields = require("./schema/insertDynamicFields");

var insertQueue = [];
var schemaLoaded = false;
var running = false;
var didStop = false;
var isIdle = false;
var droppedRowsErrors = [];

const ingest = async (config, nextTick = 10000) => {
  if (droppedRowsErrors.length > 5) {
    console.log(`We have dropped a few rows`, droppedRowsErrors);
    droppedRowsErrors = [];
  }

  didStop = false;

  if (!running) {
    console.log("Ingestion has been stopped");
    didStop = true;
    return;
  }

  if (!schemaLoaded) {
    console.log("Not inserting as schema hasn't loaded yet");
    await timersPromises.setTimeout(nextTick / 10);
    ingest(config, nextTick);
    return;
  }

  var queue = [...insertQueue];
  insertQueue = [];

  if (queue.length == 0) {
    isIdle = true;
    console.log(`Queue empty, checking again in ${nextTick}`);
  } else {
    isIdle = false;
  }

  for (const entry of queue) {
    const putBackIntoQueue = (err) => {
      if (entry.currentRetries > 5) {
        console.log("Dropping event as retries was too high");
        droppedRowsErrors.push(err);
      } else {
        insertQueue.push({
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
        putBackIntoQueue(new Error("not valid against schema"));
      } catch (err) {
        putBackIntoQueue(err);
        console.error("Failed to create dynamic fields", err);
      }
    } else {
      try {
        await config.bigquery
          .dataset(config.dataset)
          .table(entry.table)
          .insert([entry.row]);
      } catch (err) {
        console.error("Failed to insert into BQ", JSON.stringify(err, null, 2));

        if (err.name == "PartialFailureError") {
          console.log(
            "Ignoring PartialFailureError we should be eventually consistent"
          );
        } else {
          putBackIntoQueue(err);
        }
      }
    }
  }

  await timersPromises.setTimeout(nextTick);
  ingest(config, nextTick);
};

module.exports = {
  addToQueue: (entry) => {
    insertQueue.push(entry);
  },
  start: (
    config,
    nextTick,
    shouldSetupSchema = true,
    processOnSigterm = true
  ) => {
    running = true;

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
        await ingest(config, nextTick);
      });
    }

    ingest(config, nextTick);
  },
  stop: async () => {
    running = false;

    return new Promise((resolve) => {
      var interval = setInterval(() => {
        if (didStop) {
          clearInterval(interval);

          setTimeout(() => {
            resolve();
          }, 100);
        }
      }, 5);
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
      }, 5);
    });
  },
  getQueue: () => insertQueue,
};
