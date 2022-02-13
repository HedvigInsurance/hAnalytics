const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("sets up a table correctly", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "description",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});

test("updates a table correctly", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "description",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables().length).toEqual(1);

  await setupTable(
    "mock_table",
    "description",
    [
      {
        name: "property",
        type: "STRING",
      },
      {
        name: "property_2",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});
