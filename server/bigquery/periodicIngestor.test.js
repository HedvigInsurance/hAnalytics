const {
  start,
  stop,
  addToQueue,
  waitUntilIdle,
  consumeQueue,
} = require("./periodicIngestor");
const timersPromises = require("timers/promises");
const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");
const setupTable = require("./schema/setupTable");
const createBigQueryConfigMock = require("./config.mock");
const { bigQuerySchemaTypeMap } = require("../../commons/typeMaps");

test("ingests correctly", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, createInMemoryBackend(), 100, false, false);

  await setupTable(
    "mock_table",
    "a mock table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  await addToQueue({
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
  start(bigQueryConfig, createInMemoryBackend(), 25, false, false);

  await setupTable(
    "mock_table",
    "a mock table",
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
  start(bigQueryConfig, createInMemoryBackend(), 5, false, false);

  await setupTable(
    "mock_table",
    "a mock table",
    [
      {
        name: "property",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "context_something",
        ...bigQuerySchemaTypeMap("String"),
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 25;

  [...new Array(numberOfRows)].forEach((_, index) => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
        context_something: Math.random(),
      },
    });

    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
        context_something: "value",
      },
    });
  });

  await waitUntilIdle();
  await stop();

  expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
    numberOfRows
  );
}, 20000);

test("does keep invalid rows", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, createInMemoryBackend(), 5, false, false);

  await setupTable(
    "mock_table",
    "a mock table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 25;

  [...new Array(numberOfRows)].forEach((_, index) => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
        context_something_invalid: index,
      },
    });
  });

  await timersPromises.setTimeout(1000);
  await waitUntilIdle();
  await stop();

  expect(await consumeQueue()).toMatchSnapshot();
}, 20000);

test("does ingest if tables update", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, createInMemoryBackend(), 10, false, false);

  await setupTable(
    "mock_table",
    "a mock table",
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
    "a mock table",
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
  start(bigQueryConfig, createInMemoryBackend(), 10, false, false);

  await setupTable(
    "embark_track",
    "a mock table",
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

test("does respect source version", async () => {
  const bigQueryConfig = createBigQueryConfigMock();
  start(bigQueryConfig, createInMemoryBackend(), 5, false, false);

  process.env.SOURCE_VERSION = 0;

  await setupTable(
    "mock_table",
    "a mock table",
    [
      {
        name: "property",
        type: "STRING",
      },
    ],
    bigQueryConfig
  );

  const numberOfRows = 25;

  [...new Array(numberOfRows)].forEach((_, index) => {
    addToQueue({
      table: "mock_table",
      row: {
        property: "HELLO",
        context_something_invalid: index,
      },
    });
  });

  await timersPromises.setTimeout(1000);
  await waitUntilIdle();

  process.env.SOURCE_VERSION = 1;

  await waitUntilIdle();

  process.env.SOURCE_VERSION = 2;

  await waitUntilIdle();

  process.env.SOURCE_VERSION = 3;

  await waitUntilIdle();

  process.env.SOURCE_VERSION = 4;

  await waitUntilIdle();

  process.env.SOURCE_VERSION = 5;

  await waitUntilIdle();
  await stop();

  expect((await consumeQueue()).length).toEqual(0);
}, 20000);
