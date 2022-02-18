const typeMaps = require("../../../commons/typeMaps");
const { contextFields, eventFields } = require("./schemaFields");
const sortFields = require("./sortFields");

const eventToSchemaFields = async (
  event,
  bigQueryConfig,
  propertyPrefix = `property_`
) => {
  var propertiesField = {
    name: "properties",
    description: "Properties associated with this event",
    type: "STRUCT",
    fields: [],
  };

  const addFields = async (input) => {
    let typeOptions = typeMaps.bigQuerySchemaTypeMap(input.type);

    if (!typeOptions) {
      return;
    }

    if (Array.isArray(typeOptions)) {
      typeOptions.forEach((option) => {
        propertiesField.fields.push({
          ...option,
          name: `${propertyPrefix}${input.name}`,
          description: input.description || "",
        });
      });
    } else {
      propertiesField.fields.push({
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
            },
          },
          {
            ...bigQueryConfig,
            injectLoadedAtField: false,
          },
          ""
        );

        if (fields.length) {
          propertiesField.fields.push({
            name: aggregateEvent.name,
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

  return sortFields(
    [
      excludeEventFields ? [] : await eventFields(),
      !propertiesField.length ? [] : [propertiesField],
      excludeContextFields ? [] : await contextFields(),
    ].flatMap((i) => i)
  );
};

module.exports = eventToSchemaFields;
