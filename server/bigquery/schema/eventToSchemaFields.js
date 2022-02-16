const getEvents = require("../../../commons/getEvents");
const typeMaps = require("../../../commons/typeMaps");
const { generalFields, contextFields, eventFields } = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = async (event, base = {}, bigQueryConfig) => {
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

  if (event.bigQuery?.addAggregatePropertyFields) {
    const events = await bigQueryConfig.getEvents();

    for (aggregateEvent of events) {
      if (
        aggregateEvent.name !== event.name &&
        aggregateEvent.bigQuery?.excludeFromAggregate !== true
      ) {
        const fields = await eventToSchemaFields(
          {
            ...aggregateEvent,
            bigQuery: {
              ...aggregateEvent.bigQuery,
              noEventFields: true,
              noContextFields: true,
              noGeneralFields: true,
            },
          },
          base[`properties_${aggregateEvent.name}`],
          bigQueryConfig
        );

        if (fields.length) {
          propertyFields.push({
            name: `properties_${aggregateEvent.name}`,
            description: aggregateEvent.description || "",
            type: "STRUCT",
            mode: "NULLABLE",
            fields,
          });
        }
      }
    }
  }

  const excludeEventFields = event.bigQuery?.noEventFields === true;
  const excludeContextFields = event.bigQuery?.noContextFields === true;
  const excludeGeneralFields = event.bigQuery?.noGeneralFields === true;

  return sortFields(
    [
      excludeEventFields ? [] : await eventFields(),
      propertyFields,
      excludeGeneralFields ? [] : await generalFields(),
      excludeContextFields ? [] : await contextFields(),
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
