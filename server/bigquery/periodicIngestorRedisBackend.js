const RedisTaskQueue = require("redis-task-queue");
const redisUrlParse = require("redis-url-parse");

const queue = "periodicIngestor";

module.exports = () => {
  const redisTaskQueue = new RedisTaskQueue(
    process.env.REDIS_URL
      ? {
          ...redisUrlParse(process.env.REDIS_URL),
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {
          port: 6379,
          host: "127.0.0.1",
          password: "",
        }
  );

  return {
    append: async (entry) => {
      try {
        redisTaskQueue.add({
          queue,
          data: {
            entry,
          },
        });
      } catch (err) {
        console.error("[REDIS] failed to add message to queue", err);
      }
    },
    consume: async (maxNumberOfItems = 100) => {
      const numberOfItems = Math.min(
        await redisTaskQueue.has(queue),
        maxNumberOfItems
      );

      var list = [];

      for (var i = 0; i < numberOfItems; i++) {
        try {
          const job = await redisTaskQueue.get(queue);
          list.push(job.entry);
        } catch (err) {
          console.log(
            "[REDIS] encountered error when trying to fetch from queue",
            err
          );
        }
      }

      return list;
    },
  };
};
