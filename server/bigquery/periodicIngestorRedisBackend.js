const RedisTaskQueue = require("redis-task-queue");
const redisUrlParse = require("redis-url-parse");

const redisTaskQueue = new RedisTaskQueue(
  process.env.REDIS_URL
    ? redisUrlParse(process.env.REDIS_URL)
    : {
        port: 6379,
        host: "127.0.0.1",
        password: "",
      }
);

const queue = "periodicIngestor";

module.exports = {
  append: async (item) => {
    redisTaskQueue.add({
      queue,
      data: item,
    });
  },
  consume: async () => {
    const numberOfItems = Math.min(await redisTaskQueue.has(queue), 100);

    var list = [];

    for (var i = 0; i < numberOfItems; i++) {
      const job = await redisTaskQueue.get(queue);
      list.push(job);
    }

    return list;
  },
};
