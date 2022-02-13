const getEvents = require("../../../commons/getEvents");
const typeMaps = require("../../../commons/typeMaps");
const getSchema = require("./getSchema");

const insertDynamicFields = async (name, row, bigQueryConfig) => {
  const event = (await getEvents()).find((event) => event.name == name);

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const metadata = await getSchema(name, bigQueryConfig);
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
        console.log(`Key ${key} not in inputs or constants`);
        return null;
      }

      const type = typeMaps.bigQuerySchemaTypeMap(typeMaps.jsTypeMap(row[key]));

      if (!type) {
        console.log(`No matching type for ${key}`);
        return null;
      }

      console.log(
        `Matching key ${key} to type ${JSON.stringify(type, null, 2)}`
      );

      return {
        name: key,
        ...type,
      };
    })
    .filter((i) => i);

  const table = bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(name);

  const filteredFields = fields.filter(
    (field) =>
      !schema.fields.find((schemaField) => schemaField.name == field.name)
  );

  const new_schema = schema;
  new_schema.fields = [new_schema.fields, filteredFields].flatMap((i) => i);
  metadata.schema = new_schema;

  await table.setMetadata(metadata);

  bigQueryConfig.cacher.set(`schema-${name}`, metadata);
};

module.exports = insertDynamicFields;
