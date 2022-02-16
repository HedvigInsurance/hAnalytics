const eventToSchemaFields = require("./eventToSchemaFields");

const filterFieldsAccordingToEvent = async (eventName, row, bigQueryConfig) => {
  const event = (await bigQueryConfig.getEvents()).find(
    (event) => event.name === eventName
  );

  if (!event) {
    return {};
  }

  const fields = await eventToSchemaFields(event, row, bigQueryConfig);
  const result = {};

  Object.keys(row).forEach((key) => {
    const field = fields.find((field) => field.name === key);

    if (!field) {
      return;
    }

    result[key] = row[key];
  });

  return result;
};

module.exports = filterFieldsAccordingToEvent;
