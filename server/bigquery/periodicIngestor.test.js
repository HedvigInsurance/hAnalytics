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
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, inMemoryBackend, 100, false, false);

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

  await waitUntilIdle();
  await stop();

  expect(await consumeQueue()).toMatchSnapshot();
  expect(mockConfig.bigquery.getTables()).toMatchSnapshot();
});

test("ingests exact amount of rows", async () => {
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, inMemoryBackend, 25, false, false);

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

  const numberOfRows = 10000;

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

  expect(mockConfig.bigquery.getTables()[0].rows.length).toEqual(numberOfRows);
});

test("doesnt ingest invalid rows", async () => {
  jest.setTimeout(20000);
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, inMemoryBackend, 5, false, false);

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

  const numberOfRows = 100;

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

  expect(mockConfig.bigquery.getTables()[0].rows.length).toEqual(numberOfRows);
});

test("does ingest if tables update", async () => {
  jest.setTimeout(20000);
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, inMemoryBackend, 10, false, false);

  await setupTable(
    "mock_table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    mockConfig
  );

  const numberOfRows = 100;

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
    mockConfig
  );

  await waitUntilIdle();
  await stop();

  expect(mockConfig.bigquery.getTables()[0].rows.length).toEqual(numberOfRows);
  expect(mockConfig.bigquery.getTables()[1].rows.length).toEqual(numberOfRows);
});

test("does ingest if schema updates", async () => {
  jest.setTimeout(20000);
  const mockConfig = createBigQueryConfigMock();
  start(mockConfig, inMemoryBackend, 10, false, false);

  await setupTable(
    "embark_track",
    [
      {
        name: "event_id",
        type: "STRING",
      },
    ],
    mockConfig
  );

  const numberOfRows = 100;

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
        [`property_store_${index * 1000}_null`]: null,
      },
    });
  });

  await waitUntilIdle();
  await stop();

  expect(mockConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows * 2
  );
  expect(mockConfig.bigquery.getTables()).toMatchSnapshot();
});
