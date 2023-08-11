const { createClient } = require("redis");
const StatsD = require("node-statsd");
const Counter = require("./counter");

const statsdClient = new StatsD({
  host: "telegraf",
});

const queueName = process.env.REDIS_QUEUE_NAME;

if (!queueName) {
  throw new Error("no queue name");
}

class RedisClient extends Counter {
  constructor() {
    super();

    this.client = createClient({
      url: "redis://redis-master:6379",
    });
    this.client.on("error", (err) => console.log("Redis Client Error", err));
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async produce(message) {
    await this.client.lPush(queueName, message);
    this.incrementProduceAmount();
    statsdClient.increment("redis_producer_message");
  }

  async consume() {
    const result = await this.client.rPop(queueName, 0);
    if (result) {
      this.incrementConsumeAmount();
      statsdClient.increment("redis_consumer_message");
    }
    return result;
  }

  getClient() {
    return this.client;
  }
}

module.exports = RedisClient;
