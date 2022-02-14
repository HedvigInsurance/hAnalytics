const bigQueryConfig = require("./config");
const flattenObj = require("./flattenObj");
const omit = require("./omit");
const { addToQueue, start } = require("./periodicIngestor");
const createRedisBackend = require("./periodicIngestorRedisBackend");
const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");
const uuid = require("uuid");

const track = async (name, event) => {
  const flatEvent = flattenObj(event);

  const eventInsertEntry = {
    table: name,
    row: {
      ...flatEvent,
      event: name,
      timestamp: bigQueryConfig.bigquery.datetime(
        event.timestamp.toISOString()
      ),
    },
  };

  addToQueue(eventInsertEntry);

  const rawEventInsertEntry = {
    table: "raw",
    row: {
      event_id: uuid.v1(),
      event: "raw",
      property_data: JSON.stringify(eventInsertEntry.row),
      timestamp: bigQueryConfig.bigquery.datetime(
        event.timestamp.toISOString()
      ),
      tracking_id: flatEvent.tracking_id,
    },
  };

  addToQueue(rawEventInsertEntry);

  const flatTrack = flattenObj(omit("property", event));

  const trackInsertEntry = {
    table: "tracks",
    row: {
      ...flatTrack,
      event: name,
      timestamp: bigQueryConfig.bigquery.datetime(
        event.timestamp.toISOString()
      ),
    },
  };

  addToQueue(trackInsertEntry);

  const rawTrackInsertEntry = {
    table: "raw",
    row: {
      event_id: uuid.v1(),
      event: "raw",
      property_data: JSON.stringify(trackInsertEntry.row),
      timestamp: bigQueryConfig.bigquery.datetime(
        event.timestamp.toISOString()
      ),
      tracking_id: flatEvent.tracking_id,
    },
  };

  addToQueue(rawTrackInsertEntry);
};

const identify = async (identity) => {
  const flatIdentity = flattenObj(identity);

  const insertEntry = {
    table: "identifies",
    row: {
      ...flatIdentity,
      timestamp: bigQueryConfig.bigquery.datetime(new Date().toISOString()),
    },
  };

  addToQueue(insertEntry);
};

const getBackend = () => {
  if (process.env.REDIS_QUEUE) {
    console.log("Using redis backend");
    return createRedisBackend();
  }

  console.log("Using in memory backend");
  return createInMemoryBackend();
};

start(bigQueryConfig, getBackend(), process.env.BQ_INGESTION_INTERVAL);

module.exports = {
  track,
  identify,
};
