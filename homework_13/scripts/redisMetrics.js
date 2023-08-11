const redis = require("redis");
const StatsD = require("node-statsd");
const RedisClient = require("./redisClient");

const statsdClient = new StatsD({
  host: "telegraf",
});

const queueName = process.env.REDIS_QUEUE_NAME;

if (!queueName) {
  throw new Error("no queue name");
}

const redisClient = new RedisClient();

const fetchQueueLength = async () => {
  try {
    const length = await redisClient.getClient().lLen(queueName);

    console.log("queue length", { length });

    statsdClient.gauge("redis_queue_length", length, { queue_name: queueName });
  } catch (err) {
    console.error(err);
  }
};

redisClient
  .connect()
  .then(() => {
    console.log("Redis client connected");
    setInterval(fetchQueueLength, 1000); // Adjust the interval as needed
  })
  .catch((err) => {
    console.error("Redis connect error:", err);
  });
