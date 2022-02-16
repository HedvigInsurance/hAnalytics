const typeMaps = require("../../../commons/typeMaps");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  const metadata = bigQueryConfig.cacher.get(`schema-${name}`);

  const validateField = async (field, row) => {
    const key = field.name;

    if (row[key] == null && field.mode === "REQUIRED") {
      return field;
    }

    if (row[key] == null && field.mode === "NULLABLE") {
      return;
    }

    if (Array.isArray(row[key]) && field.mode === "REPEATED") {
      const validatedFields = await Promise.all(
        row[key].map(async (item) => {
          const hanalyticsType = typeMaps.jsTypeMap(item);
          const bigQueryType = await typeMaps.bigQuerySchemaTypeMap(
            hanalyticsType
          );

          return bigQueryType?.type === field.type;
        })
      );

      const invalid = validatedFields.includes(false);

      if (invalid) {
        return field;
      }

      return;
    }

    if (
      field.type === "TIMESTAMP" &&
      (typeof row[key]?.value === "string" || typeof row[key] === "string")
    ) {
      return;
    }

    if (field.type === "RECORD" || field.type === "STRUCT") {
      const fieldResults = [];

      for (structField of field.fields) {
        fieldResults.push(await validateField(structField, row[key]));
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

    const hanalyticsType = typeMaps.jsTypeMap(row[key]);
    const bigQueryType = await typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

    if (bigQueryType?.type !== field.type) {
      console.log(
        `Got type ${bigQueryType?.type} for ${key} but expected ${field.type}`
      );
      return field;
    }

    if (field?.permittedValues && !field.permittedValues.includes(row[key])) {
      return field;
    }

    return;
  };

  const fieldResults = await Promise.all(
    metadata.schema.fields.map((field) => validateField(field, row))
  );
  const invalidFields = fieldResults.filter((i) => i);

  if (invalidFields.length) {
    console.log(
      `Struck some invalid fields when validating ${name}`,
      invalidFields
    );
  }

  return invalidFields.length === 0;
};

module.exports = validateAgainstSchema;
