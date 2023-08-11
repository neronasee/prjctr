const BeanstalkdClient = require("./beanstalkdClient");
const { consumeMessages } = require("./utils");

const beanstalkdClient = new BeanstalkdClient();

beanstalkdClient.connect().then(() => {
  consumeMessages(beanstalkdClient);
});
