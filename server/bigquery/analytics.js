const bigQueryConfig = require("./config");
const { start } = require("./periodicIngestor");
const createRedisBackend = require("./periodicIngestorRedisBackend");
const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");
const trackers = require("./trackers");

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

const track = async (event) => {
  trackers.track(event, bigQueryConfig, state);
};

const identify = async (identity) => {
  trackers.identify(identity, bigQueryConfig, state);
};

module.exports = {
  track,
  identify,
};
