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

const mockContextObj = {
  app: {
    build: "1234",
    name: "hedvig",
    namespace: "mock.hedvig.app",
    version: "abc",
  },
  device: {
    id: "an_id",
    manufacturer: "Apple",
    model: "iPhone8,1",
    type: "iphone",
    name: "iphone",
    screen: {
      height: 100,
      width: 100,
      density: 1,
    },
    os: {
      name: "macOS",
      version: "8",
    },
  },
  ip: "::1",
  locale: "sv_SE",
  session: {
    id: "mock",
  },
  timezone: "Europe/Stockholm",
  traits: {
    member: {
      id: "123",
    },
  },
};

const mockEventObj = {
  name: "mock",
  id: "mock",
  timestamp: "2022-02-30",
  ingested: "2022-02-30",
};

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
          context: mockContextObj,
          event: mockEventObj,
          properties: {
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
            context: mockContextObj,
            event: mockEventObj,
            properties: {
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
            context: mockContextObj,
            event: mockEventObj,
            properties: {
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
            context: mockContextObj,
            event: mockEventObj,
            properties: {
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
