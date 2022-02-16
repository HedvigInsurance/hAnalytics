const typeMaps = require("../../../commons/typeMaps");
const { generalFields, contextFields, eventFields } = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = async (event, base = {}) => {
  var propertyFields = [];

  const addFields = async (input) => {
    let typeOptions = await typeMaps.bigQuerySchemaTypeMap(input.type, base);

    if (!typeOptions) {
      return;
    }

    if (Array.isArray(typeOptions)) {
      typeOptions.forEach((option) => {
        if (option.name.startsWith(`property_${input.name}`)) {
          propertyFields.push({
            ...option,
            name: option.name ? option.name : `property_${input.name}`,
            description: input.description || "",
          });
        }
      });
    } else {
      propertyFields.push({
        name: `property_${input.name.replace(/^property_/, "")}`,
        description: input.description || "",
        ...typeOptions,
      });
    }
  };

  if (event.inputs) {
    await Promise.all(event.inputs.map(addFields));
  }

  if (event.constants) {
    await Promise.all(event.constants.map(addFields));
  }

  if (event.graphql) {
    await Promise.all(event.graphql.selectors.map(addFields));
  }

  const excludeEventFields = event.bigQuery?.noEventFields === true;
  const excludeContextFields = event.bigQuery?.noContextFields === true;

  return sortFields(
    [
      excludeEventFields ? [] : await eventFields(),
      propertyFields,
      await generalFields(),
      excludeContextFields ? [] : await contextFields(),
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
