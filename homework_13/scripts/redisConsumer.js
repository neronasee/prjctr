const RedisClient = require("./redisClient");
const { consumeMessages } = require("./utils");
const redisClient = new RedisClient();

redisClient.connect().then(() => {
  consumeMessages(redisClient);
});
