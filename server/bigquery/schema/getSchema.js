const cacher = require("./cacher");

const getSchema = async (name, { bigquery, dataset }) => {
  const table = bigquery.dataset(dataset).table(name);
  const [metadata] = await table.getMetadata();
  cacher.set(`schema-${name}`, metadata);
  return metadata;
};

module.exports = getSchema;
