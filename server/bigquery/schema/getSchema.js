const getSchema = async (name, { bigquery, dataset }) => {
  const table = bigquery.dataset(dataset).table(name);
  const [metadata] = await table.getMetadata();
  return metadata;
};

module.exports = getSchema;
