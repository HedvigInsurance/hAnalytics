const omit = require("../omit");
const getSchema = require("./getSchema");
const sortFields = require("./sortFields");

const updateSchema = async (
  tableName,
  fields,
  description,
  bigQueryConfig,
  numberOfRetries = 0
) => {
  var currentMetadata = bigQueryConfig.cacher.get(`schema-${tableName}`);

  if (!currentMetadata) {
    currentMetadata = await getSchema(tableName, bigQueryConfig);
  }

  const table = bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(tableName);

  const includedNames = [];

  var updatedMetadata = {
    ...currentMetadata,
    description: description ? description : currentMetadata.description,
    schema: {
      ...currentMetadata.schema,
      fields: sortFields([...currentMetadata.schema.fields, ...fields])
        .filter((field) => {
          if (includedNames.includes(field.name)) {
            return false;
          }

          includedNames.push(field.name);

          return true;
        })
        .map((field) => omit("permittedValues", field)),
    },
  };

  if (JSON.stringify(currentMetadata) !== JSON.stringify(updatedMetadata)) {
    try {
      await table.setMetadata(updatedMetadata);
      bigQueryConfig.cacher.set(`schema-${tableName}`, updatedMetadata);
    } catch (err) {
      if (numberOfRetries < 5) {
        await getSchema(tableName, bigQueryConfig);
        await updateSchema(
          tableName,
          fields,
          description,
          bigQueryConfig,
          numberOfRetries + 1
        );
      }
    }
  }
};

module.exports = updateSchema;
