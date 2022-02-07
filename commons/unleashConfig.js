const { Strategy, InMemStorageProvider } = require("unleash-client");

const { createClient } = require("redis");

class RedisStorageProvider {
  client = null;

  constructor() {
      const redisUrl = process.env.REDIS_URL
    this.client = createClient({
      url: redisUrl,
      socket: {
        // Heroku uses self-signed certificate, which will cause error in connection, unless check is disabled
        tls: redisUrl.startsWith("rediss://"),
        rejectUnauthorized: false,
      },
    });
    this.client.connect();
  }

  async set(key, data) {
    await this.client.set(key, JSON.stringify(data));
  }

  async get(key) {
    const data = await this.client.get(key);
    return JSON.parse(data);
  }
}

class MemberIdsStrategy extends Strategy {
  constructor() {
    super("MemberIds");
  }

  isEnabled(parameters, context) {
    return parameters.memberIds.includes(context.memberId);
  }
}

module.exports = {
  appName: "hanalytics",
  url: process.env.UNLEASH_API_URL,
  customHeaders: {
    Authorization: process.env.UNLEASH_API_KEY,
  },
  environment: process.env.UNLEASH_API_KEY.replace("*:").split(".")[0],
  strategies: [new MemberIdsStrategy()],
  storageProvider: process.env.REDIS_URL
    ? new RedisStorageProvider()
    : new InMemStorageProvider(),
};
