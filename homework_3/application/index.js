const express = require("express");
const { MongoClient } = require("mongodb");
const { Client } = require("@elastic/elasticsearch");

const app = express();
const port = 5050;
// some random metric to expose to tele
let requestCount = 0;

app.use((req, res, next) => {
  requestCount++;

  // call next middleware function
  next();
});

const connectToMongo = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    console.log("Connected successfully to MongoDB");
    return client.db("test");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const connectToElastic = () => {
  try {
    const client = new Client({ node: process.env.ELASTIC_URI });
    console.log("Connected successfully to Elasticsearch");
    return client;
  } catch (error) {
    console.error("Error connecting to Elasticsearch:", error);
    process.exit(1);
  }
};

let db;
let esClient;

(async () => {
  db = await connectToMongo();
  esClient = await connectToElastic();
})();

app.get("/", async (req, res) => {
  try {
    if (Math.random() < 0.05) {
      throw new Error("random error occured with 5% chance");
    }

    const visit = {
      timestamp: new Date(),
      info: "New visit to the homepage",
    };

    // Index the same document in Elasticsearch
    await esClient.index({
      index: "visits",
      body: visit,
    });

    // Insert a document in MongoDB
    await db.collection("visits").insertOne(visit);

    res.send("New visit recorded in MongoDB and Elasticsearch!");
  } catch (error) {
    console.error("Error processing visit:", error);
    res.status(500).send("Error processing visit");
  }
});

app.get("/metrics", (req, res) => {
  res.json({ requestCount });
});

app.listen(port, () => {
  console.log(`Node.js app listening at http://localhost:${port}`);
});
