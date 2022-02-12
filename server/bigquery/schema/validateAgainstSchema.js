const getSchema = require("./getSchema");
const typeMaps = require("../../../commons/typeMaps");
const cacher = require("./cacher");

const validateAgainstSchema = async (name, row, { bigquery, dataset }) => {
  const metadata =
    cacher.get(`schema-${name}`) ||
    (await getSchema(name, { bigquery, dataset }));

  const schema = metadata.schema ?? {
    fields: [],
  };

  return !Object.keys(row).find((key) => {
    if (row[key] == null) {
      return false;
    }

    const field = schema.fields.find((field) => field.name == key);

    if (!field) {
      console.log(`missing property ${key} on ${name}`);
      return true;
    }

    if (Array.isArray(row[key]) && row[key].length == 0) {
      return false;
    }

    if (key === "timestamp") {
      return false;
    }

    const hanalyticsType = typeMaps.jsTypeMap(row[key]);
    const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

    if (bigQueryType?.type !== field.type) {
      console.log(`Got type ${bigQueryType?.type} but expected ${field.type}`);
      return true;
    }

    return false;
  });
};

module.exports = validateAgainstSchema;
