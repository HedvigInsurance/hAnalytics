const getSchema = require("./getSchema");
const typeMaps = require("../../../commons/typeMaps");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  const metadata =
    bigQueryConfig.cacher.get(`schema-${name}`) ||
    (await getSchema(name, bigQueryConfig));

  const schema = metadata.schema ?? {
    fields: [],
  };

  return !schema.fields.find((field) => {
    const key = field.name;

    // old depreceated fields that we no longer care about
    if (key === "context_device_id" || key === "context_device_version") {
      return false;
    }

    if (row[key] == null && field.mode === "REQUIRED") {
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

    if (
      field.type === "TIMESTAMP" &&
      (typeof row[key]?.value === "string" || typeof row[key] === "string")
    ) {
      return false;
    }

    const hanalyticsType = typeMaps.jsTypeMap(row[key]);
    const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

    if (bigQueryType?.type !== field.type) {
      console.log(
        `Got type ${bigQueryType?.type} for ${key} but expected ${field.type}`
      );
      return true;
    }

    return false;
  });
};

module.exports = validateAgainstSchema;
