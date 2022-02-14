const getEvents = require("../../../commons/getEvents");
const typeMaps = require("../../../commons/typeMaps");
const getSchema = require("./getSchema");
const sortFields = require("./sortFields");
const timersPromises = require("timers/promises");

const insertDynamicFields = async (name, tableName, row, bigQueryConfig) => {
  const event = (await getEvents()).find((event) => event.name == name);

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const metadata =
    bigQueryConfig.cacher.get(`schema-${tableName}`) ||
    (await getSchema(tableName, bigQueryConfig));
  const schema = metadata.schema ?? {
    fields: [],
  };

  const fields = Object.keys(row)
    .map((key) => {
      if (schema.fields.find((field) => field.name === key)) {
        return null;
      }

      if (
        ![...(event.inputs ?? []), ...(event.constants ?? [])].find((input) =>
          key.startsWith(`property_${input.name}`)
        )
      ) {
        return null;
      }

      const type = typeMaps.bigQuerySchemaTypeMap(
        `Optional<${typeMaps.jsTypeMap(row[key])}>`
      );

      if (!type?.type) {
        return null;
      }

      return {
        name: key,
        ...type,
      };
    })
    .filter((i) => i);

  const table = bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(tableName);

  if (fields.length) {
    const currentMetadata = await getSchema(tableName, bigQueryConfig);
    const includedNames = [];

    var updatedSchema = {
      ...currentMetadata,
      schema: {
        ...currentMetadata.schema,
        fields: sortFields([
          ...currentMetadata.schema.fields,
          ...fields,
        ]).filter((field) => {
          if (includedNames.includes(field.name)) {
            return false;
          }

          includedNames.push(field.name);

          return true;
        }),
      },
    };

    await table.setMetadata(updatedSchema);
    bigQueryConfig.cacher.set(`schema-${tableName}`, updatedSchema);
  }
};

module.exports = insertDynamicFields;
