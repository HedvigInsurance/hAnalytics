const typeMaps = require("../../../commons/typeMaps");
const getSchema = require("./getSchema");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  var metadata = bigQueryConfig.cacher.get(`schema-${name}`);

  if (!metadata) {
    metadata = await getSchema(name, bigQueryConfig);
  }

  const validateField = (field, value) => {
    const key = field.name;

    if (field.type === "BOOLEAN") {
      if (value === true || value === false) {
        return;
      }
    }

    if (value == null && field.mode === "REQUIRED") {
      return field;
    }

    if (value == null && field.mode === "NULLABLE") {
      return;
    }

    if (field.type === "RECORD" || field.type === "STRUCT") {
      const itemsToValidate = [];

      if (field.mode === "REPEATED") {
        if (!Array.isArray(value)) {
          return {
            ...field,
            fields: field.fields,
          };
        }

        for (item of value) {
          itemsToValidate.push(item);
        }
      } else {
        itemsToValidate.push(value);
      }

      const fieldResults = [];

      for (itemToValidate of itemsToValidate) {
        for (structField of field.fields) {
          const invalidField = validateField(
            structField,
            itemToValidate[structField.name]
          );
          fieldResults.push(invalidField);
        }
      }

      const invalidFields = fieldResults.filter((i) => i);

      if (invalidFields.length) {
        return {
          ...field,
          fields: invalidFields,
        };
      }

      return;
    }

    if (Array.isArray(value) && field.mode === "REPEATED") {
      const validatedFields = value.map((item) => {
        const hanalyticsType = typeMaps.jsTypeMap(item);
        const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

        return bigQueryType?.type === field.type;
      });

      const invalid = validatedFields.includes(false);

      if (invalid) {
        return field;
      }

      return;
    }

    if (field.type === "TIMESTAMP") {
      const timestamp = value?.value || value;

      if (!Date.parse(timestamp)) {
        return field;
      }

      return;
    }

    const hanalyticsType = typeMaps.jsTypeMap(value);
    const bigQueryType = typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

    if (bigQueryType?.type !== field.type) {
      console.log(
        `Got type ${bigQueryType?.type} for ${key} but expected ${field.type}`
      );
      return field;
    }

    if (field?.permittedValues && !field.permittedValues.includes(value)) {
      return field;
    }

    return;
  };

  const fieldResults = metadata.schema.fields.map((field) =>
    validateField(field, row[field.name])
  );
  const invalidFields = fieldResults.filter((i) => i);

  if (invalidFields.length) {
    console.log(
      `Struck some invalid fields when validating ${name}`,
      JSON.stringify(invalidFields, null, 2),
      JSON.stringify(row, null, 2)
    );
  }

  return invalidFields.length === 0;
};

module.exports = validateAgainstSchema;
