const timersPromises = require("timers/promises");
const setupSchema = require("./setupSchema");
const validateAgainstSchema = require("./schema/validateAgainstSchema");
const insertDynamicFields = require("./schema/insertDynamicFields");

var insertQueue = [];
var schemaLoaded = false;
var running = false;
var droppedRowsErrors = [];

const ingest = async (config, nextTick = 10000) => {
  if (droppedRowsErrors.length > 5) {
    console.warn(
      `We have dropped a few rows`,
      JSON.stringify(droppedRowsErrors, null, 2)
    );
  }

  if (!running) {
    console.log("Ingestion has been stopped");
    return;
  }

  if (!schemaLoaded) {
    console.log("Not inserting as schema hasn't loaded yet");
    setTimeout(() => {
      ingest(config, nextTick);
    }, nextTick / 10);
    return;
  }

  var queue = [...insertQueue];
  insertQueue = [];

  if (queue.length == 0) {
    console.log(`Queue empty, checking again in ${nextTick}`);
  }

  for (const entry of queue) {
    console.log(`inserting row into BQ ${entry.table}`);

    const valid = await validateAgainstSchema(entry.table, entry.row, config);

    if (!valid) {
      console.log(
        "Not valid event against schema, trying to insert dynamic fields"
      );

      try {
        await insertDynamicFields(entry.table, entry.row, config);
        await timersPromises.setTimeout(5000);
      } catch (err) {
        console.error("Failed to create dynamic fields", err);
      }
    }

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
      } else if (entry.currentRetries > 5) {
        console.error("Dropping event as retries was too high");
        droppedRowsErrors.push(err);
      } else {
        insertQueue.push({
          ...entry,
          currentRetries: (entry.currentRetries ?? 0) + 1,
        });
      }
    }
  }

  setTimeout(() => {
    ingest(config, nextTick);
  }, nextTick);
};

process.on("SIGTERM", async () => {
  console.log("Processing before exiting");
  await ingest();
});

module.exports = {
  addToQueue: (entry) => {
    insertQueue.push(entry);
  },
  start: (config, nextTick) => {
    running = true;
    setupSchema(() => {
      schemaLoaded = true;
    }, config);

    ingest(config, nextTick);
  },
  stop: () => {
    running = false;
  },
  getQueue: () => insertQueue,
};
