const BeanstalkdClient = require("./beanstalkdClient");
const { produceMessages } = require("./utils");

const beanstalkdClient = new BeanstalkdClient();

beanstalkdClient.connect().then(() => {
  produceMessages(beanstalkdClient);
});
