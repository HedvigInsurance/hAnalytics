const { BigQuery } = require("@google-cloud/bigquery");
const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
    : undefined,
});

const dataset = process.env.BQ_DATASET;

module.exports = {
  dataset,
  bigquery,
};
