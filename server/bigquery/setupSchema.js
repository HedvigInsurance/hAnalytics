const getEvents = require("../../commons/getEvents");
const setupTable = require("./schema/setupTable");
const eventToSchemaFields = require("./schema/eventToSchemaFields");
const createView = require("./schema/createView");

const setupSchema = async (onLoad, bigQueryConfig) => {
  const events = await getEvents();

  await Promise.all(
    events.map(async (event) => {
      const schemaFields = eventToSchemaFields(event);

      await setupTable(event.name, schemaFields, bigQueryConfig);

      if (event.bigQuery?.noEventFields !== true) {
        await createView(event.name, schemaFields, bigQueryConfig);
      }
    })
  );

  onLoad();
};

module.exports = setupSchema;
