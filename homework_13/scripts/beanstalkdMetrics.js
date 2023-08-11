const StatsD = require("node-statsd");
const BeanstalkdClient = require("./beanstalkdClient");

const statsdClient = new StatsD({
  host: "telegraf",
});

const tubeName = process.env.BEANSTALKD_TUBE_NAME;

if (!tubeName) {
  throw new Error("no tube name");
}

const client = new BeanstalkdClient();

const monitorTubeLength = async () => {
  try {
    await client.connect();

    setInterval(async () => {
      const stats = await client.getClient().statsTube(tubeName);
      const readyJobs = stats["current-jobs-ready"];
      const delayedJobs = stats["current-jobs-delayed"];
      const buriedJobs = stats["current-jobs-buried"];

      const totalJobs = readyJobs + delayedJobs + buriedJobs;

      console.log({ totalJobs });

      // Send the metric to StatsD as a gauge
      statsdClient.gauge("beanstalkd_queue_length", totalJobs, {
        tube_name: tubeName,
      });
    }, 1000); // Adjust the interval as needed
  } catch (err) {
    console.error(err);
    client.disconnect();
  }
};

monitorTubeLength();
