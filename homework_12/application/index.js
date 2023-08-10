const express = require("express");
const redis = require("redis");
const { faker, tr } = require("@faker-js/faker");

const StatsD = require("node-statsd");
const statsdClient = new StatsD({
  host: "telegraf",
});

const app = express();
const client = redis.createClient({
  url: "redis://redis-master:6379",
});

const totalPeople = 300000;
const prepopulateAmount = 0.5;
const maxTTL = 60;

const people = Array.from({ length: totalPeople }, (value, index) => ({
  id: index,
  name: faker.person.firstName(),
  lastName: faker.person.lastName(),
  address: faker.person.bio(),
  ip: faker.internet.ipv6(),
  email: faker.internet.email(),
}));

const peopleIds = people.map(({ id }) => id);

async function fetchData(id) {
  // Generating fake data
  return people.find((person) => person.id === Number(id));
}

let totalRequests = 0;
let cacheHits = 0;

// Endpoint to get a person by ID
app.get("/randomPerson", async (req, res, next) => {
  totalRequests++;

  const topSegmentLength = Math.floor(peopleIds.length * 0.2);
  const bottomSegmentLength = peopleIds.length - topSegmentLength;

  let randomIndex;
  if (Math.random() < 0.9) {
    randomIndex = Math.floor(Math.random() * topSegmentLength);
  } else {
    randomIndex =
      topSegmentLength + Math.floor(Math.random() * bottomSegmentLength);
  }

  const id = peopleIds[randomIndex].toString();

  try {
    let result = await client.get(id);

    if (result) {
      cacheHits++;
      statsdClient.increment("cache_hits");
      result = JSON.parse(result);
      const ttl = await client.ttl(id);
      const recomputationProbability = (maxTTL - ttl) / maxTTL;

      if (Math.random() < recomputationProbability) {
        const data = await fetchData(id);
        await client.set(id, JSON.stringify(data), {
          EX: maxTTL,
        });
        res.json(data);
      } else {
        res.json(result);
      }
    } else {
      statsdClient.increment("cache_misses");
      const data = await fetchData(id);
      await client.set(id, JSON.stringify(data), {
        EX: maxTTL,
      });
      res.json(data);
    }
  } catch (err) {
    next(err);
  }

  const hitRate = totalRequests ? (cacheHits / totalRequests) * 100 : 0;

  statsdClient.gauge("hit_rate", hitRate);
});

app.listen(5050, async () => {
  await client.connect();

  console.log("Server is running on port 5050");
});
