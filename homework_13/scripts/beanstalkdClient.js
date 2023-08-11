const { Client, BeanstalkJobState } = require("node-beanstalk");
const StatsD = require("node-statsd");
const Counter = require("./counter");

const statsdClient = new StatsD({
  host: "telegraf",
});

const tubeName = process.env.BEANSTALKD_TUBE_NAME;

if (!tubeName) {
  throw new Error("no tube name");
}

class BeanstalkdClient extends Counter {
  constructor() {
    super();

    this.client = new Client({
      host: "beanstalkd", // Assuming the container name in Docker Compose is 'beanstalkd'
      port: 11300, // Default port for Beanstalkd
    });
    this.tube = tubeName; // Replace with your desired tube name
  }

  async connect() {
    await this.client.connect();
    await this.client.use(this.tube);
    await this.client.watch(this.tube);
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async produce(payload, priority = 40) {
    const putJob = await this.client.put(payload, priority);
    if (putJob.state !== BeanstalkJobState.ready) {
      throw new Error("job is not in ready state");
    }
    this.incrementProduceAmount();
    statsdClient.increment("beanstalkd_producer_message");
  }

  async consume(timeout = 10) {
    const job = await this.client.reserveWithTimeout(timeout);
    // Perform necessary processing with job.data here
    if (job) {
      this.client.delete(job.id);
      this.incrementConsumeAmount();
      statsdClient.increment("beanstalkd_consumer_message");
    }

    return job.payload;
  }

  getClient() {
    return this.client;
  }
}

module.exports = BeanstalkdClient;
