const typeMaps = require("../../../commons/typeMaps");
const { contextFields, eventFields } = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = async (event, bigQueryConfig) => {
  var propertiesField = {
    name: "properties",
    description: "Properties associated with this event",
    type: "STRUCT",
    mode: "REQUIRED",
    fields: [],
  };

  const addFields = async (input) => {
    let typeOption = typeMaps.bigQuerySchemaTypeMap(input.type);

    if (!typeOption) {
      return;
    }

    propertiesField.fields.push({
      name: input.name,
      description: input.description || "",
      ...typeOption,
    });
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
            },
          },
          {
            ...bigQueryConfig,
            injectLoadedAtField: false,
          },
          ""
        );

        if (fields[0]?.fields.length) {
          propertiesField.fields.push({
            name: aggregateEvent.name,
            description: aggregateEvent.description || "",
            type: "STRUCT",
            mode: "NULLABLE",
            fields: fields[0].fields,
          });
        }
      }
    }
  }

  const excludeEventFields = event.bigQuery?.noEventFields === true;
  const excludeContextFields = event.bigQuery?.noContextFields === true;

  return sortFields(
    [
      excludeEventFields ? [] : eventFields,
      !propertiesField.fields.length ? [] : [propertiesField],
      excludeContextFields ? [] : contextFields,
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
