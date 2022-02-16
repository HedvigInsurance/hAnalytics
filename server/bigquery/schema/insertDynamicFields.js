const getSchema = require("./getSchema");
const sortFields = require("./sortFields");
const eventToSchemaFields = require("./eventToSchemaFields");

const insertDynamicFields = async (name, tableName, row, bigQueryConfig) => {
  const event = (await bigQueryConfig.getEvents()).find(
    (event) => event.name == name
  );

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const metadata =
    bigQueryConfig.cacher.get(`schema-${tableName}`) ||
    (await getSchema(tableName, bigQueryConfig));
  const schema = metadata.schema ?? {
    fields: [],
  };

  const fields = await eventToSchemaFields(event, row);

  const table = bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(tableName);

  if (fields.length) {
    const currentMetadata = await getSchema(tableName, bigQueryConfig);
    const includedNames = [];

    var updatedSchema = {
      ...currentMetadata,
      schema: {
        ...currentMetadata.schema,
        fields: sortFields([
          ...currentMetadata.schema.fields,
          ...fields,
        ]).filter((field) => {
          if (includedNames.includes(field.name)) {
            return false;
          }

          includedNames.push(field.name);

          return true;
        }),
      },
    };

    await table.setMetadata(updatedSchema);
    bigQueryConfig.cacher.set(`schema-${tableName}`, updatedSchema);
  }
};

module.exports = insertDynamicFields;
