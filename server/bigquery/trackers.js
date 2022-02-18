const omit = require("./omit");
const transform = require("../../definitions/transforms");
const { addToQueue } = require("./periodicIngestor");
const deepmerge = require("deepmerge");

const parseTimestamp = (value, bigQueryConfig) => {
  // assume its a bq obj
  if (value?.value) {
    return value;
  }

  if (value?.toISOString) {
    return bigQueryConfig.bigquery.datetime(value.toISOString()).value;
  }

  return value;
};

const track = async (event, bigQueryConfig, ingestorState) => {
  const completeEvent = deepmerge(event, {
    event: {
      ingested: parseTimestamp(new Date(), bigQueryConfig),
      timestamp: parseTimestamp(event.event.timestamp, bigQueryConfig),
    },
  });

  for (transformedEvent of transform(completeEvent)) {
    const eventInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}${transformedEvent.event.name}`,
      eventName: transformedEvent.event.name,
      row: transformedEvent,
    };

    addToQueue(eventInsertEntry, ingestorState);

    const aggregateInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}aggregate`,
      eventName: "aggregate",
      row: {
        ...omit("properties", transformedEvent),
        properties: {
          [transformedEvent.event.name]: transformedEvent.properties,
        },
      },
    };

    addToQueue(aggregateInsertEntry, ingestorState);

    const rawEventInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}raw`,
      eventName: "raw",
      row: {
        ...transformedEvent,
        data: JSON.stringify(transformedEvent),
      },
    };

    addToQueue(rawEventInsertEntry, ingestorState);

    const eventOmittedProperties = omit("properties", transformedEvent);

    const trackInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}tracks`,
      eventName: "tracks",
      row: {
        ...eventOmittedProperties,
      },
    };

    addToQueue(trackInsertEntry, ingestorState);
  }
};

const identify = async (identity, bigQueryConfig, ingestorState) => {
  const insertEntry = {
    table: `${bigQueryConfig.tablePrefix}identify`,
    eventName: "identify",
    row: {
      ...identity,
      event: {
        ...identity.event,
        name: "identify",
        timestamp: parseTimestamp(new Date(), bigQueryConfig),
      },
    },
  };

  addToQueue(insertEntry, ingestorState);
};

module.exports = {
  track,
  identify,
};
