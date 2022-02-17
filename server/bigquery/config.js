const { BigQuery } = require("@google-cloud/bigquery");
const getEvents = require("../../commons/getEvents");
const bigquery = new BigQuery(
  process.env.GOOGLE_CREDENTIALS
    ? {
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      }
    : undefined
);

const dataset = process.env.BQ_DATASET;

module.exports = {
  cacher: require("./cacher")(),
  dataset,
  bigquery,
  tablePrefix: "",
  injectLoadedAtField: false,
  projectId: process.env.GCLOUD_PROJECT,
  getEvents: getEvents,
};
