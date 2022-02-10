const uuid = require("uuid");
const timersPromises = require("timers/promises");
const { dataset, bigquery } = require("./config");
const {
  setupSchema,
  validateAgainstSchema,
  insertDynamicFields,
} = require("./schema");
const flattenObj = require("./flattenObj");

var insertQueue = [];
var schemaLoaded = false;

setupSchema(() => {
  schemaLoaded = true;
});

const omit = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

const track = async (name, event) => {
  const flatEvent = flattenObj(event);

  const eventInsertEntry = {
    table: name,
    row: {
      ...flatEvent,
      event: name,
      event_id: uuid.v1(),
      timestamp: bigquery.datetime(event.timestamp.toISOString()),
    },
  };

  insertQueue.push(eventInsertEntry);

  const flatTrack = flattenObj(omit("property", event));

  const trackInsertEntry = {
    table: "tracks",
    row: {
      ...flatTrack,
      event: name,
      event_id: uuid.v1(),
      timestamp: bigquery.datetime(event.timestamp.toISOString()),
    },
  };

  insertQueue.push(trackInsertEntry);
};

const identify = async (identity) => {
  const flatIdentity = flattenObj(identity);

  const insertEntry = {
    table: "identifies",
    row: {
      ...flatIdentity,
      timestamp: bigquery.datetime(new Date().toISOString()),
    },
  };

  insertQueue.push(insertEntry);
};

const processQueue = async () => {
  if (!schemaLoaded) {
    console.log("Not inserting as schema hasn't loaded yet");
    setTimeout(processQueue, 1000);
    return;
  }

  var queue = [...insertQueue];
  insertQueue = [];

  for (const entry of queue) {
    console.log(`inserting row into BQ ${entry.table}`);

    const valid = await validateAgainstSchema(entry.table, entry.row);

    if (!valid) {
      console.log(
        "Not valid event against schema, trying to insert dynamic fields"
      );

      try {
        await insertDynamicFields(entry.table, entry.row);
        await timersPromises.setTimeout(5000);
      } catch (err) {
        console.error("Failed to create dynamic fields", err);
      }
    }

    try {
      await bigquery.dataset(dataset).table(entry.table).insert([entry.row]);
    } catch (err) {
      console.error("Failed to insert into BQ", JSON.stringify(err, null, 2));

      if (err.name == "PartialFailureError") {
        console.log(
          "Ignoring PartialFailureError we should be eventually consistent"
        );
      } else if (entry.currentRetries > 5) {
        console.error("Dropping event as retries was too high");
      } else {
        insertQueue.push({
          ...entry,
          currentRetries: (entry.currentRetries ?? 0) + 1,
        });
      }
    }
  }

  setTimeout(processQueue, 10000);
};

processQueue();

process.on("beforeExit", async () => {
  console.log("Processing before exiting");
  await processQueue();
});

module.exports = {
  track,
  identify,
};
