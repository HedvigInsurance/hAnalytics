const getSchema = require("./getSchema");
const sortFields = require("./sortFields");
const updateSchema = require("./updateSchema");

const setupTable = async (name, description = "", fields, bigQueryConfig) => {
  try {
    const metadata = {
      schema: {
        fields: sortFields(fields),
      },
      description: description,
      timePartitioning: {
        type: "DAY",
        expirationMS: "7776000000",
        field: "timestamp",
      },
    };

    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(name, metadata);

    bigQueryConfig.cacher.set(`schema-${name}`, metadata);
  } catch (err) {
    await updateSchema(name, fields, description, bigQueryConfig);
  }
};

module.exports = setupTable;
