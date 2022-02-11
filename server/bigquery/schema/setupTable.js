const getSchema = require("./getSchema");

const setupTable = async (name, fields, { bigquery, dataset }) => {
  try {
    await bigquery.dataset(dataset).createTable(name, {
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
    const table = bigquery.dataset(dataset).table(name);
    const metadata = await getSchema(name, { bigquery, dataset });

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
