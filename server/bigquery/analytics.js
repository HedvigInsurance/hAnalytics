const bigQueryConfig = require("./config");
const flattenObj = require("./flattenObj");
const omit = require("./omit");
const { addToQueue, start } = require("./periodicIngestor");

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

start(bigQueryConfig);

module.exports = {
  track,
  identify,
};
