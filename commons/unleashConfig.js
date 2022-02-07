const { Strategy, InMemStorageProvider } = require("unleash-client");

const { createClient } = require("redis");

class RedisStorageProvider {
  async getClient() {
    const redisUrl = process.env.REDIS_URL;
    const client = createClient({
      url: redisUrl,
      socket: {
        // Heroku uses self-signed certificate, which will cause error in connection, unless check is disabled
        tls: redisUrl.startsWith("rediss://"),
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    return client;
  }

  async set(key, data) {
    try {
        const client = await this.getClient();
        await client.set(key, JSON.stringify(data));
    } catch (err) {
        console.error("Redis error", err)
    }
  }

  async get(key) {
    try {
        const data = await client.get(key);
        return JSON.parse(data);
    } catch (err) {
        console.error("Redis error", err)
        return null
    }
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
  storageProvider: new InMemStorageProvider(),
};
