const { start, stop, addToQueue, getQueue } = require("./periodicIngestor");
const setupTable = require("./schema/setupTable");
const createBigQueryConfigMock = require("./config.mock");
const timersPromises = require("timers/promises");

test("ingests correctly", async () => {
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, 100);

  setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    mockConfig
  );

  addToQueue({
    table: "mock_table",
    row: {
      property: "HELLO",
    },
  });

  await timersPromises.setTimeout(200);

  expect(getQueue()).toMatchSnapshot();
  expect(mockConfig.bigquery.getTables()).toMatchSnapshot();

  stop();

  await timersPromises.setTimeout(500);
});
