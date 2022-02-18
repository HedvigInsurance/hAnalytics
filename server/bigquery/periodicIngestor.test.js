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
        bigQuery: {
          noContextFields: true,
          noEventFields: true,
        },
      },
    ]);
    const state = start(bigQueryConfig, createInMemoryBackend(), 100);
    await state.schemaLoaded;

    await addToQueue(
      {
        table: "mock_event",
        eventName: "mock_event",
        row: {
          property: {
            hello: "HELLO",
          },
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
        eventName: "mock_event",
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
          eventName: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property: {
              hello: "HELLO",
            },
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
          eventName: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property: {
              hello: "HELLO",
              hello_other: Math.random(),
            },
          },
        },
        state
      );

      addToQueue(
        {
          table: "mock_event",
          eventName: "mock_event",
          row: {
            ...(await mockContextProperties()),
            ...(await mockEventProperties()),
            ...(await mockGeneralProperties()),
            property: {
              hello: "HELLO",
              hello_other: "value",
            },
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
});
