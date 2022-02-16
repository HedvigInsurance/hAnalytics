const eventToSchemaFields = require("./eventToSchemaFields");
const updateSchema = require("./updateSchema");

const insertDynamicFields = async (name, tableName, row, bigQueryConfig) => {
  const event = (await bigQueryConfig.getEvents()).find(
    (event) => event.name == name
  );

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const fields = await eventToSchemaFields(event, row);

  if (fields.length) {
    await updateSchema(tableName, fields, null, bigQueryConfig);
  }
};

module.exports = insertDynamicFields;
