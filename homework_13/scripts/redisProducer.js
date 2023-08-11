const RedisClient = require("./redisClient");
const { produceMessages } = require("./utils");

const redisClient = new RedisClient();

redisClient.connect().then(() => {
  produceMessages(redisClient);
});
