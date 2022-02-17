const {
  start,
  stop,
  addToQueue,
  waitUntilIdle,
  consumeQueue,
} = require("./periodicIngestor");
const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");
const createBigQueryConfigMock = require("./config.mock");
const schemaFields = require("./schema/schemaFields");

const mockFieldReducer = (acc, curr) => {
  switch (curr.type) {
    case "INTEGER":
      acc[curr.name] = 0;
      return acc;
    case "BOOLEAN":
      acc[curr.name] = true;
      return acc;
    case "STRING":
      acc[curr.name] = "mock";
      return acc;
    case "TIMESTAMP":
      acc[curr.name] = "2020-02-10";
      return acc;
  }

  return acc;
};

const mockContextProperties = async () =>
  (await schemaFields.contextFields()).reduce(mockFieldReducer, {});

const mockEventProperties = async () =>
  (await schemaFields.eventFields()).reduce(mockFieldReducer, {});

const mockGeneralProperties = async () =>
  (await schemaFields.generalFields()).reduce(mockFieldReducer, {});

describe("periodicIngestor", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  test("ingests correctly", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 100);
    await state.schemaLoaded;

    await addToQueue(
      {
        table: "mock_event",
        row: {
          property_hello: "HELLO",
        },
      },
      state
    );

    await waitUntilIdle(state);
    await stop(state);

    expect(await consumeQueue(state)).toMatchSnapshot();
    expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
  }, 10000);

  test("ingests exact amount of rows", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 25);
    await state.schemaLoaded;

    const numberOfRows = 50;
    const rows = [...new Array(numberOfRows)].map((_, index) => index);

    for (row of rows) {
      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property_hello: "HELLO",
          },
        },
        state
      );
    }

    await waitUntilIdle(state);
    await stop(state);

    expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
      numberOfRows
    );
  }, 10000);

  test("doesnt ingest invalid rows", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
          {
            name: "hello_other",
            type: "Double",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 5);
    await state.schemaLoaded;

    const numberOfRows = 25;
    const rows = [...new Array(numberOfRows)].map((_, index) => index);

    for (row of rows) {
      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property_hello: "HELLO",
            property_hello_other: Math.random(),
          },
        },
        state
      );

      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property_hello: "HELLO",
            property_hello_other: "value",
          },
        },
        state
      );
    }

    await waitUntilIdle(state);
    await stop(state);

    expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
      numberOfRows
    );
  }, 10000);

  test("does keep invalid rows", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
          {
            name: "hello_other",
            type: "Double",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 5);
    await state.schemaLoaded;

    const numberOfRows = 25;
    const rows = [...new Array(numberOfRows)].map((_, index) => index);

    for (row of rows) {
      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property: "HELLO",
            context_something_invalid: row,
          },
        },
        state
      );
    }

    await waitUntilIdle(state);
    await stop(state);

    expect(await consumeQueue(state)).toMatchSnapshot();
  }, 10000);

  test("does ingest dynamic fields", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
          {
            name: "hello_other",
            type: "Dictionary<String, Any>",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 10);

    await state.schemaLoaded;

    const numberOfRows = 30;
    const rows = [...new Array(numberOfRows)].map((_, index) => index);

    for (row of rows) {
      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property_hello: "hello",
          },
        },
        state
      );

      addToQueue(
        {
          table: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property_hello: "hello",
            [`property_hello_other_field`]: "HELLO",
            [`property_hello_other_field_double`]: 150,
            [`property_hello_other_field_bool`]: true,
            [`property_hello_other_field_array`]: ["string", "string2"],
          },
        },
        state
      );
    }

    await waitUntilIdle(state);
    await stop(state);

    expect(bigQueryConfig.bigquery.getTables()[0].rows.length).toEqual(
      numberOfRows * 2
    );
    expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
  }, 10000);

  test("does respect source version", async () => {
    const bigQueryConfig = createBigQueryConfigMock([
      {
        name: "mock_event",
        inputs: [
          {
            name: "hello",
            type: "String",
          },
          {
            name: "hello_other",
            type: "Dictionary<String, Any>",
          },
        ],
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 5);
    await state.schemaLoaded;

    process.env.SOURCE_VERSION = 0;

    const numberOfRows = 25;
    const rows = [...new Array(numberOfRows)].map((_, index) => index);

    for (row of rows) {
      addToQueue(
        {
          table: "mock_table",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            context_something_invalid: row,
          },
        },
        state
      );
    }

    await waitUntilIdle(state);

    process.env.SOURCE_VERSION = 1;

    await waitUntilIdle(state);

    process.env.SOURCE_VERSION = 2;

    await waitUntilIdle(state);

    process.env.SOURCE_VERSION = 3;

    await waitUntilIdle(state);

    process.env.SOURCE_VERSION = 4;

    await waitUntilIdle(state);

    process.env.SOURCE_VERSION = 5;

    await waitUntilIdle(state);
    await stop(state);

    expect((await consumeQueue(state)).length).toEqual(0);
  }, 10000);
});
