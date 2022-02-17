const flattenObj = require("./flattenObj");
const omit = require("./omit");
const transform = require("../../definitions/transforms");
const { addToQueue } = require("./periodicIngestor");

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

const track = async (name, event, bigQueryConfig, ingestorState) => {
  const completeEvent = {
    ...event,
    event: name,
    timestamp: parseTimestamp(event.timestamp, bigQueryConfig),
    loaded_at: bigQueryConfig.injectLoadedAtField
      ? parseTimestamp(new Date(), bigQueryConfig)
      : null,
  };

  for (transformedEvent of transform(completeEvent)) {
    const eventInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}${transformedEvent.event}`,
      eventName: transformedEvent.event,
      row: transformedEvent,
    };

    addToQueue(eventInsertEntry, ingestorState);

    const aggregateInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}aggregate`,
      eventName: "aggregate",
      row: {
        ...omit("property", transformedEvent),
        event_id: transformedEvent.event_id,
        event: transformedEvent.event,
        [`properties_${transformedEvent.event}`]: transformedEvent.property,
        timestamp: transformedEvent.timestamp,
        tracking_id: transformedEvent.tracking_id,
        loaded_at: completeEvent.loaded_at,
      },
    };

    addToQueue(aggregateInsertEntry, ingestorState);

    const rawEventInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}raw`,
      eventName: "raw",
      row: {
        event_id: transformedEvent.event_id,
        event: "raw",
        property_data: JSON.stringify(transformedEvent),
        timestamp: transformedEvent.timestamp,
        tracking_id: transformedEvent.tracking_id,
        loaded_at: completeEvent.loaded_at,
      },
    };

    addToQueue(rawEventInsertEntry, ingestorState);

    const eventOmittedProperty = omit("property", transformedEvent);

    const trackInsertEntry = {
      table: `${bigQueryConfig.tablePrefix}tracks`,
      eventName: "tracks",
      row: {
        ...eventOmittedProperty,
        loaded_at: completeEvent.loaded_at,
      },
    };

    addToQueue(trackInsertEntry, ingestorState);
  }
};

const identify = async (identity, bigQueryConfig, ingestorState) => {
  const flatIdentity = flattenObj(identity);

  const insertEntry = {
    table: `${bigQueryConfig.tablePrefix}identifies`,
    eventName: "identifies",
    row: {
      ...flatIdentity,
      timestamp: parseTimestamp(new Date(), bigQueryConfig),
    },
  };

  addToQueue(insertEntry, ingestorState);
};

module.exports = {
  track,
  identify,
};
