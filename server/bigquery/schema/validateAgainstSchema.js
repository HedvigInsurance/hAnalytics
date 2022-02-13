const getSchema = require("./getSchema");
const typeMaps = require("../../../commons/typeMaps");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  const metadata =
    bigQueryConfig.cacher.get(`schema-${name}`) ||
    (await getSchema(name, bigQueryConfig));

  const schema = metadata.schema ?? {
    fields: [],
  };

  return !Object.keys(row).find((key) => {
    const field = schema.fields.find((field) => field.name == key);

    if (!field) {
      console.log(`missing property ${key} on ${name}`);
      return true;
    }

    if (row[key] == null && field.mode === "NULLABLE") {
      return false;
    }

    if (Array.isArray(row[key]) && field.mode === "REPEATED") {
      return row[key]
        .map((item) => {
          const hanalyticsType = typeMaps.jsTypeMap(item);
          const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

          return bigQueryType?.type === field.type;
        })
        .includes(false);
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
