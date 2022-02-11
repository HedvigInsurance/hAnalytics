const getSchema = require("./getSchema");
const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("can get schema", async () => {
  const { bigquery, dataset } = createBigQueryConfigMock();

  await setupTable(
    "embark_track",
    [
      {
        name: "property_store_hello",
        type: "STRING",
      },
    ],
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables()).toMatchSnapshot();

  const schema = await getSchema("embark_track", {
    bigquery,
    dataset,
  });

  expect(schema).toMatchSnapshot();
});
