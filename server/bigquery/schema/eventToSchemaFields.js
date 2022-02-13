const typeMaps = require("../../../commons/typeMaps");
const { generalFields, contextFields, eventFields } = require("./schemaFields");

const eventToSchemaFields = (event) => {
  var propertyFields = [];

  if (event.inputs) {
    event.inputs.forEach((input) => {
      let typeOptions = typeMaps.bigQuerySchemaTypeMap(input.type);

      if (!typeOptions) {
        return;
      }

      propertyFields.push({
        name: `property_${input.name}`,
        ...typeOptions,
      });
    });
  }

  if (event.constants) {
    event.constants.forEach((constant) => {
      let typeOptions = typeMaps.bigQuerySchemaTypeMap(constant.type);

      if (!typeOptions) {
        return;
      }

      propertyFields.push({
        name: `property_${constant.name}`,
        ...typeOptions,
      });
    });
  }

  if (event.graphql) {
    event.graphql.selectors.forEach((selector) => {
      let typeOptions = typeMaps.bigQuerySchemaTypeMap(selector.type);

      if (!typeOptions) {
        return;
      }

      propertyFields.push({
        name: `property_${selector.name}`,
        ...typeOptions,
      });
    });
  }

  const excludeEventFields = event.bigQuery?.noEventFields === true;
  const excludeContextFields = event.bigQuery?.noContextFields === true;

  return [
    excludeEventFields ? [] : eventFields,
    excludeContextFields ? [] : contextFields,
    generalFields,
    propertyFields,
  ].flatMap((i) => i);
};

module.exports = eventToSchemaFields;
