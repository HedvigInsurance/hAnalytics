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
      return false;
    }

    if (value === null && field.mode === "NULLABLE") {
      return true;
    }

    if (field.mode === "REPEATED") {
      if (!Array.isArray(value)) {
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
      return false;
    }

    return true;
  };

  const validationResults = metadata.schema.fields.map((field) => {
    const valid = validateField(field, row[field.name]);

    if (!valid) {
      console.log(
        `Struck invalid field when validating ${name}`,
        JSON.stringify(field, null, 2),
        JSON.stringify(row[field.name], null, 2)
      );
    }

    return valid;
  });

  return !validationResults.includes(false);
};

module.exports = validateAgainstSchema;
