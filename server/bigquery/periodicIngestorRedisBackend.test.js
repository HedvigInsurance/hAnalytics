const redisBackend = require("./periodicIngestorRedisBackend");
const { BigQueryDatetime } = require("@google-cloud/bigquery");
const Redis = require("ioredis-mock");

describe("periodicIngestorRedisBackend", () => {
  beforeEach((done) => {
    new Redis().flushall().then(() => done());
  });

  test("stores and consumes correctly", async () => {
    redisBackend.append({
      mock: "mock",
    });

    expect((await redisBackend.consume()).length).toEqual(1);
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

  test("reparses DateTime correctly", async () => {
    const dateTime = new BigQueryDatetime(new Date().toISOString());

    const mockItem = {
      mock: "mock",
      timestamp: dateTime,
    };

    redisBackend.append(mockItem);

    const list = await redisBackend.consume();

    expect(list).toEqual([mockItem]);
  });
});
