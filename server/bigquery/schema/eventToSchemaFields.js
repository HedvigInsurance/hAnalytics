const typeMaps = require("../../../commons/typeMaps");
const {
  generalFields,
  contextFields,
  eventFields,
  loadedAtFields,
} = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = async (
  event,
  bigQueryConfig,
  propertyPrefix = `property_`
) => {
  var propertyFields = [];

  const addFields = async (input) => {
    let typeOptions = await typeMaps.bigQuerySchemaTypeMap(input.type);

    if (!typeOptions) {
      return;
    }

    if (Array.isArray(typeOptions)) {
      typeOptions.forEach((option) => {
        propertyFields.push({
          ...option,
          name: `${propertyPrefix}${input.name}`,
          description: input.description || "",
        });
      });
    } else {
      propertyFields.push({
        name: `${propertyPrefix}${input.name}`,
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

  if (event.bigQuery?.includeAggregateProperties === true) {
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
          {
            ...bigQueryConfig,
            injectLoadedAtField: false,
          },
          ""
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
  const excludeLoadedAtField = !bigQueryConfig.injectLoadedAtField;

  return sortFields(
    [
      excludeEventFields ? [] : await eventFields(),
      propertyFields,
      excludeGeneralFields ? [] : await generalFields(),
      excludeContextFields ? [] : await contextFields(),
      excludeLoadedAtField ? [] : await loadedAtFields(),
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
