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

    const filteredFields = schema.fields.filter(
      (schemaField) => !fields.find((field) => field.name == schemaField.name)
    );

    const new_schema = schema;
    new_schema.fields = [...filteredFields, ...fields];
    metadata.schema = new_schema;

    try {
      await table.setMetadata(metadata);
    } catch (err) {
      console.log(err);
      if (
        err.errors.find((error) =>
          error.message.includes("has changed mode from NULLABLE to REQUIRED")
        )
      ) {
        console.log("deleting");

        await setupTable(name, fields, bigQueryConfig);
      }
    }
  }
};

module.exports = setupTable;
