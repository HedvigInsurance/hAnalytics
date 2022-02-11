const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("sets up a table correctly", async () => {
  const { bigquery, dataset } = createBigQueryConfigMock();

  setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables()).toMatchSnapshot();
});

test("updates a table correctly", async () => {
  const { bigquery, dataset } = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables().length).toEqual(1);

  await setupTable(
    "mock_table",
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
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables()).toMatchSnapshot();
});
