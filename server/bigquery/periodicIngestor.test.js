const {
  start,
  stop,
  addToQueue,
  waitUntilIdle,
  consumeQueue,
} = require("./periodicIngestor");
const inMemoryBackend = require("./periodicIngestorInMemoryBackend");
const setupTable = require("./schema/setupTable");
const createBigQueryConfigMock = require("./config.mock");

test("ingests correctly", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, inMemoryBackend, 100, false, false);

  setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  addToQueue({
    table: "mock_table",
    row: {
      property: "HELLO",
    },
  });

  await waitUntilIdle();
  await stop();

  expect(await consumeQueue()).toMatchSnapshot();
  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});

test("ingests exact amount of rows", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, inMemoryBackend, 25, false, false);

  setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 50;

  [...new Array(numberOfRows)].forEach(() => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
      },
    });
  });

  await waitUntilIdle();
  await stop();

  expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows
  );
});

test("doesnt ingest invalid rows", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, inMemoryBackend, 5, false, false);

  setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 25;

  [...new Array(numberOfRows)].forEach(() => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
        context_something_invalid: Math.random(),
      },
    });

    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
      },
    });
  });

  await waitUntilIdle();
  await stop();

  expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows
  );
}, 20000);

test("does ingest if tables update", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, inMemoryBackend, 10, false, false);

  await setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 25;

  [...new Array(numberOfRows)].forEach(() => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
      },
    });

    addToQueue({
      table: "mock_table2",
      row: {
        property_2: "HELLO",
      },
    });
  });

  await setupTable(
    "mock_table2",
    [
      {
        name: "property_2",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  await waitUntilIdle();
  await stop();

  expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows
  );
  expect(bigQueryConfig.bigquery.getTables()[1].rows.length).toEqual(
    numberOfRows
  );
}, 20000);

test("does ingest if schema updates", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, inMemoryBackend, 10, false, false);

  await setupTable(
    "embark_track",
    [
      {
        name: "event_id",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 30;

  [...new Array(numberOfRows)].forEach((_, index) => {
    addToQueue({
      table: "embark_track",
      row: {
        event_id: "mock_id",
      },
    });

    addToQueue({
      table: "embark_track",
      row: {
        event_id: "mock_id",
        [`property_store_${index * 1000}`]: "HELLO",
        [`property_store_${index * 1000}_double`]: 150,
        [`property_store_${index * 1000}_bool`]: true,
        [`property_store_${index * 1000}_array`]: ["string", "string2"],
      },
    });
  });

  await waitUntilIdle();
  await stop();

  expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows * 2
  );
  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
}, 20000);
