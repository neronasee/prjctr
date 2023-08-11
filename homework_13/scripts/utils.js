const { faker } = require("@faker-js/faker");

const benchmarkTime = process.env.BENCHMARK_TIME_MINS * 60 * 1000;

if (!benchmarkTime) {
  throw new Error("unknown benchmark time");
}

const consumeMessages = async (client) => {
  let noMessageCount = 0;

  try {
    const endTime = Date.now() + benchmarkTime;

    while (Date.now() < endTime) {
      const message = await client.consume();
      if (message) {
        // console.log(`Message consumed: ${message}`);
      } else {
        noMessageCount++;
        console.log("no message");

        if (noMessageCount >= 100000) {
          break;
        }
      }
    }

    console.log("Finished consuming messages");
    await client.disconnect();
    console.log("Consumed messages", client.getResult().consumeAmount);
    process.exit(0);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const produceMessages = async (client) => {
  try {
    const endTime = Date.now() + benchmarkTime; // 2 minutes from now

    while (Date.now() < endTime) {
      const message = faker.lorem.word();
      await client.produce(message);
      // console.log(`Message produced: ${message}`);
    }

    console.log("Finished producing messages");
    await client.disconnect();
    console.log("Produced messages", client.getResult().produceAmount);
    process.exit(0);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

module.exports = { consumeMessages, produceMessages };
