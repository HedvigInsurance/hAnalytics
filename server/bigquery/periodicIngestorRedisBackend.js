const RedisTaskQueue = require("redis-task-queue");
const redisUrlParse = require("redis-url-parse");
const { BigQueryDatetime } = require("@google-cloud/bigquery");

const queue = "periodicIngestor";

const cleanObj = (obj) => {
  if (!obj) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  var copy = {};
  Object.keys(obj).forEach((key) => {
    const possibleTimestampValue = obj[key]?.value;

    if (typeof possibleTimestampValue === "string") {
      copy[key] = new BigQueryDatetime(possibleTimestampValue);
    } else {
      copy[key] = cleanObj(obj[key]);
    }
  });

  return copy;
};

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
      redisTaskQueue.add({
        queue,
        data: {
          entry,
        },
      });
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

      return list.map(cleanObj);
    },
  };
};
