const getSchema = require("./getSchema");

const setupTable = async (name, fields, bigQueryConfig) => {
  try {
    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(name, {
        schema: {
          fields,
        },
        timePartitioning: {
          type: "DAY",
          expirationMS: "7776000000",
          field: "timestamp",
        },
      });
  } catch (err) {
    const table = bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(name);
    const metadata = await getSchema(name, bigQueryConfig);

    const schema = metadata.schema ?? {};

    const filteredFields = fields.filter(
      (field) =>
        !schema.fields.find((schemaField) => schemaField.name == field.name)
    );

    const new_schema = schema;
    new_schema.fields = [new_schema.fields, filteredFields].flatMap((i) => i);
    metadata.schema = new_schema;

    await table.setMetadata(metadata);
  }
};

module.exports = setupTable;
