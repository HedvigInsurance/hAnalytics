const typeMaps = require("../../../commons/typeMaps");

const validateAgainstSchema = async (name, row, bigQueryConfig) => {
  const metadata = bigQueryConfig.cacher.get(`schema-${name}`);

  var invalidFields = [];

  await Promise.all(
    metadata.schema.fields.map(async (field) => {
      const key = field.name;

      if (row[key] == null && field.mode === "REQUIRED") {
        invalidFields.push(field);
        return;
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
          invalidFields.push(field);
        }

        return;
      }

      if (
        field.type === "TIMESTAMP" &&
        (typeof row[key]?.value === "string" || typeof row[key] === "string")
      ) {
        return;
      }

      const hanalyticsType = typeMaps.jsTypeMap(row[key]);
      const bigQueryType = await typeMaps.bigQuerySchemaTypeMap(hanalyticsType);

      if (bigQueryType?.type !== field.type) {
        console.log(
          `Got type ${bigQueryType?.type} for ${key} but expected ${field.type}`
        );
        invalidFields.push(field);
        return;
      }

      if (field?.permittedValues && !field.permittedValues.includes(row[key])) {
        invalidFields.push(field);
        return;
      }

      return;
    })
  );

  if (invalidFields.length) {
    console.log(
      `Struck some invalid fields when validating ${name}`,
      invalidFields
    );
  }

  return invalidFields.length === 0;
};

module.exports = validateAgainstSchema;
