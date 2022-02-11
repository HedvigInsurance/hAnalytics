const getEvents = require("../../../commons/getEvents");
const typeMaps = require("../../../commons/typeMaps");
const getSchema = require("./getSchema");

const insertDynamicFields = async (name, row, { bigquery, dataset }) => {
  const event = (await getEvents()).find((event) => event.name == name);

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const fields = Object.keys(row)
    .map((key) => {
      if (
        ![...(event.inputs ?? []), ...(event.constants ?? [])].find((input) =>
          key.startsWith(`property_${input.name}`)
        )
      ) {
        return null;
      }

      const type = typeMaps.bigQuerySchemaTypeMap(
        typeMaps.jsTypeMap[typeof row[key]]
      )?.type;

      if (!type) {
        return null;
      }

      return {
        name: key,
        type,
      };
    })
    .filter((i) => i);

  const table = bigquery.dataset(dataset).table(name);
  const metadata = await getSchema(name, { bigquery, dataset });

  const schema = metadata.schema ?? {
    fields: [],
  };

  const filteredFields = fields.filter(
    (field) =>
      !schema.fields.find((schemaField) => schemaField.name == field.name)
  );

  const new_schema = schema;
  new_schema.fields = [new_schema.fields, filteredFields].flatMap((i) => i);
  metadata.schema = new_schema;

  await table.setMetadata(metadata);
};

module.exports = insertDynamicFields;
