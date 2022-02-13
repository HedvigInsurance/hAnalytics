const getSchema = require("./getSchema");

const setupTable = async (name, description = "", fields, bigQueryConfig) => {
  try {
    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(name, {
        schema: {
          fields,
        },
        description: description,
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

    const filteredFields = schema.fields.filter(
      (schemaField) => !fields.find((field) => field.name == schemaField.name)
    );

    const new_schema = schema;
    new_schema.fields = [...filteredFields, ...fields];
    metadata.schema = new_schema;
    metadata.description = description;

    await table.setMetadata(metadata);
  }
};

module.exports = setupTable;
