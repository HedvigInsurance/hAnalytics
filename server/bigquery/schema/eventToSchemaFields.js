const typeMaps = require("../../../commons/typeMaps");
const { generalFields, contextFields, eventFields } = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = (event, base = {}) => {
  var propertyFields = [];

  const addFields = (input) => {
    let typeOptions = typeMaps.bigQuerySchemaTypeMap(input.type, base);

    if (!typeOptions) {
      return;
    }

    if (Array.isArray(typeOptions)) {
      typeOptions.map((option) => {
        propertyFields.push({
          name: option.name ? option.name : `property_${input.name}`,
          description: input.description || "",
          ...option,
        });
      });
    } else {
      propertyFields.push({
        name: `property_${input.name}`,
        description: input.description || "",
        ...typeOptions,
      });
    }
  };

  if (event.inputs) {
    event.inputs.forEach(addFields);
  }

  if (event.constants) {
    event.constants.forEach(addFields);
  }

  if (event.graphql) {
    event.graphql.selectors.forEach(addFields);
  }

  const excludeEventFields = event.bigQuery?.noEventFields === true;
  const excludeContextFields = event.bigQuery?.noContextFields === true;

  return sortFields(
    [
      excludeEventFields ? [] : eventFields,
      propertyFields,
      generalFields,
      excludeContextFields ? [] : contextFields,
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
