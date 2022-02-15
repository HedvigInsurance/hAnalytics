const eventToSchemaFields = require("./eventToSchemaFields");

const filterFieldsAccordingToEvent = async (eventName, row, bigQueryConfig) => {
  const event = (await bigQueryConfig.getEvents()).find(
    (event) => event.name === eventName
  );

  if (!event) {
    return {};
  }

  const fields = eventToSchemaFields(event, row);
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
