const createRedisBackend = require("./periodicIngestorRedisBackend");
const { BigQueryDatetime } = require("@google-cloud/bigquery");
const Redis = require("ioredis-mock");

describe("periodicIngestorRedisBackend", () => {
  beforeEach((done) => {
    new Redis().flushall().then(() => done());
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  test("stores and consumes correctly", async () => {
    const redisBackend = createRedisBackend();

    redisBackend.append({
      mock: "mock",
      property_experiments: ["123", "456"],
    });

    expect(await redisBackend.consume()).toMatchSnapshot();
    expect((await redisBackend.consume()).length).toEqual(0);

    const numberOfItems = 5000;

    [...new Array(numberOfItems)].forEach(() => {
      redisBackend.append({
        mock: "mock",
      });
    });

    expect((await redisBackend.consume(numberOfItems / 2)).length).toEqual(
      numberOfItems / 2
    );
    expect((await redisBackend.consume(numberOfItems / 2)).length).toEqual(
      numberOfItems / 2
    );
  });
});
