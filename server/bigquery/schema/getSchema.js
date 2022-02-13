const getSchema = async (name, bigQueryConfig) => {
  const table = bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(name);
  const [metadata] = await table.getMetadata();
  bigQueryConfig.cacher.set(`schema-${name}`, metadata);
  return metadata;
};

module.exports = getSchema;
