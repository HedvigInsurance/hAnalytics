const setupTable = require("./schema/setupTable");
const eventToSchemaFields = require("./schema/eventToSchemaFields");

const setupSchema = async (onLoad, bigQueryConfig) => {
  const events = await bigQueryConfig.getEvents();

  await Promise.all(
    events.map(async (event) => {
      const schemaFields = await eventToSchemaFields(event);

      await setupTable(
        event.name,
        event.description,
        schemaFields,
        bigQueryConfig
      );
    })
  );

  onLoad();
};

module.exports = setupSchema;
