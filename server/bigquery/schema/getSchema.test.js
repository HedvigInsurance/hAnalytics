const getSchema = require("./getSchema");
const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("can get schema", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "embark_track",
    [
      {
        name: "property_store_hello",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();

  const schema = await getSchema("embark_track", bigQueryConfig);

  expect(schema).toMatchSnapshot();
});
