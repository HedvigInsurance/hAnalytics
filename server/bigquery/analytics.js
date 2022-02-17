const bigQueryConfig = require("./config");
const flattenObj = require("./flattenObj");
const omit = require("./omit");
const { addToQueue, start } = require("./periodicIngestor");
const createRedisBackend = require("./periodicIngestorRedisBackend");
const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");
const transform = require("../../definitions/transforms");

const getBackend = () => {
  if (process.env.REDIS_QUEUE) {
    console.log("Using redis backend");
    return createRedisBackend();
  }

  console.log("Using in memory backend");
  return createInMemoryBackend();
};

const state = start(
  bigQueryConfig,
  getBackend(),
  process.env.BQ_INGESTION_INTERVAL
);

const track = async (name, event) => {
  const flatEvent = flattenObj(event);
  const completeEvent = {
    ...flatEvent,
    event: name,
    timestamp: bigQueryConfig.bigquery.datetime(event.timestamp.toISOString()),
  };

  for (transformedEvent of transform(completeEvent)) {
    const eventInsertEntry = {
      table: transformedEvent.event,
      row: transformedEvent,
    };

    addToQueue(eventInsertEntry, state);

    const transformedEventWithoutProperties = Object.keys(
      transformedEvent
    ).reduce((acc, curr) => {
      if (!curr.startsWith("property_")) {
        acc[curr] = transformedEvent[curr];
      }
      return acc;
    }, {});

    const transformedEventWithProperties = Object.keys(transformedEvent).reduce(
      (acc, curr) => {
        if (curr.startsWith("property_")) {
          acc[curr] = transformedEvent[curr];
        }
        return acc;
      },
      {}
    );

    const aggregateInsertEntry = {
      table: "aggregate",
      row: {
        ...transformedEventWithoutProperties,
        event_id: transformedEvent.event_id,
        event: transformedEvent.event,
        [`properties_${transformedEvent.event}`]: {
          ...transformedEventWithProperties,
        },
        timestamp: transformedEvent.timestamp,
        tracking_id: transformedEvent.tracking_id,
      },
    };

    addToQueue(aggregateInsertEntry, state);

    const rawEventInsertEntry = {
      table: "raw",
      row: {
        event_id: transformedEvent.event_id,
        event: "raw",
        property_data: JSON.stringify(transformedEvent),
        timestamp: transformedEvent.timestamp,
        tracking_id: transformedEvent.tracking_id,
      },
    };

    addToQueue(rawEventInsertEntry, state);

    const flatTrack = omit("property", transformedEvent);

    const trackInsertEntry = {
      table: "tracks",
      row: {
        ...flatTrack,
      },
    };

    addToQueue(trackInsertEntry, state);
  }
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

  addToQueue(insertEntry, state);
};

module.exports = {
  track,
  identify,
};
