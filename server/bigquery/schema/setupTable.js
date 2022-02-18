const getSchema = require("./getSchema");
const sortFields = require("./sortFields");
const updateSchema = require("./updateSchema");

const setupTable = async (name, description = "", fields, bigQueryConfig) => {
  const [exists] = await bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table(name)
    .exists();

  if (exists) {
    await getSchema(name, bigQueryConfig);
    await updateSchema(name, fields, description, bigQueryConfig);
  } else {
    const metadata = {
      schema: {
        fields: sortFields(fields),
      },
      description: description,
      timePartitioning: {
        type: "DAY",
        expirationMS: "7776000000",
      },
    };

    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(name, metadata);

    bigQueryConfig.cacher.set(`schema-${name}`, metadata);
  }
};

module.exports = setupTable;
