const eventToSchemaFields = require("./eventToSchemaFields");

const filterFieldsAccordingToFields = (fields, row = {}) => {
  const result = {};

  fields.forEach((field) => {
    const key = field.name;

    // assume a dict
    if (field.fields && field.fields.find((field) => field.name === "key")) {
      const value = row[key];

      const valueField = field.fields.find((field) => field.name === "value");

      if (value) {
        result[key] = Object.keys(value).map((key) => {
          if (valueField.fields) {
            return {
              key,
              value: filterFieldsAccordingToFields(field.fields, value[key]),
            };
          }

          return {
            key,
            value: value[key],
          };
        });
      } else {
        result[key] = [];
      }

      return;
    }

    if (
      row === null ||
      typeof row === "undefined" ||
      typeof row[key] === "undefined"
    ) {
      result[key] = null;
    } else if (field.fields) {
      result[key] = filterFieldsAccordingToFields(field.fields, row[key]);
    } else {
      result[key] = row[key];
    }
  });

  return result;
};

const filterFieldsAccordingToEvent = async (eventName, row, bigQueryConfig) => {
  const event = (await bigQueryConfig.getEvents()).find(
    (event) => event.name === eventName
  );

  if (!event) {
    return {};
  }

  const fields = await eventToSchemaFields(event, bigQueryConfig);

  return filterFieldsAccordingToFields(fields, row);
};

module.exports = filterFieldsAccordingToEvent;
