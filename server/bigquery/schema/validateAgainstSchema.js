const typeMaps = require("../../../commons/typeMaps");
const getSchema = require("./getSchema");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  var metadata = bigQueryConfig.cacher.get(`schema-${name}`);

  if (!metadata) {
    metadata = await getSchema(name, bigQueryConfig);
  }

  const validateField = (field, value) => {
    if (field.type === "BOOLEAN") {
      if (value === true || value === false) {
        return true;
      }
    }

    if (value === null && field.mode === "REQUIRED") {
      console.log(`Value was null but mode is REQUIRED for ${field.name}`);
      return false;
    }

    if (value === null && field.mode === "NULLABLE") {
      return true;
    }

    if (field.mode === "REPEATED") {
      if (!Array.isArray(value)) {
        console.log(`Received value which wasn't an array for ${field.name}`);
        return false;
      }

      return !value
        .map((item) =>
          validateField(
            {
              ...field,
              mode: "REQUIRED",
            },
            item
          )
        )
        .includes(false);
    }

    if (field.type === "RECORD" || field.type === "STRUCT") {
      return !field.fields
        .map((field) => {
          if (!value) {
            return false;
          }

          return validateField(field, value[field.name]);
        })
        .includes(false);
    }

    if (field.type === "TIMESTAMP") {
      const timestamp = value?.value || value;

      if (!Date.parse(timestamp)) {
        console.log(`Timestamp for ${field.name} not a timestamp`);
        return false;
      }

      return true;
    }

    const hanalyticsType = typeMaps.jsTypeMap(value);
    const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

    if (bigQueryType?.type !== field.type) {
      console.log(
        `Got type ${bigQueryType?.type} for ${field.name} but expected ${field.type}`
      );
      return false;
    }

    if (field?.permittedValues && !field.permittedValues.includes(value)) {
      console.log(
        `Received value which wasn't in the permitted values for ${field.name}`
      );
      return false;
    }

    return true;
  };

  const validationResults = metadata.schema.fields.map((field) => {
    const valid = validateField(field, row[field.name]);

    return valid;
  });

  return !validationResults.includes(false);
};

module.exports = validateAgainstSchema;
