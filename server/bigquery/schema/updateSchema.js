const omit = require("../omit");
const getSchema = require("./getSchema");
const sortFields = require("./sortFields");
const deepmerge = require("deepmerge");
const printDiff = require("print-diff");

const mergeFields = (a, b) => {
  const mergedFields = [];

  [...a, ...b].forEach((field) => {
    const mergedField = mergedFields.find(
      (mergedField) => mergedField.name === field.name
    );

    if (mergedField) {
      if (mergedField.fields) {
        mergedField.fields = sortFields(
          mergeFields(mergedField.fields, field.fields || [])
        );
      }

      if (field.description) {
        mergedField.description = field.description;
      }
    } else {
      mergedFields.push(field);
    }
  });

  return mergedFields.map((field) =>
    omit(["permittedValues", "hAnalyticsType"], field)
  );
};

const updateSchema = async (tableName, fields, description, bigQueryConfig) => {
  var currentMetadata = bigQueryConfig.cacher.get(`schema-${tableName}`);

  currentMetadata.schema.fields = sortFields(currentMetadata.schema.fields);

  var updatedMetadata = deepmerge(currentMetadata, {
    schema: {
      fields,
    },
  });

  if (description) {
    updatedMetadata.description = description;
  }

  updatedMetadata.schema.fields = sortFields(
    mergeFields(currentMetadata.schema.fields, updatedMetadata.schema.fields)
  );

  if (JSON.stringify(currentMetadata) !== JSON.stringify(updatedMetadata)) {
    printDiff.inline(
      JSON.stringify(currentMetadata, null, 2),
      JSON.stringify(updatedMetadata, null, 2)
    );

    const table = bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(tableName);

    await table.setMetadata(updatedMetadata);
    bigQueryConfig.cacher.set(`schema-${tableName}`, updatedMetadata);

    return true;
  }

  return false;
};

module.exports = updateSchema;
