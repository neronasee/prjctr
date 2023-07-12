const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5050;

app.use(express.json()); // Middleware for parsing JSON data in request bodies

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

let db;

(async () => {
  db = await connectToMongo();
})();

app.post("/data", async (req, res) => {
  try {
    const data = req.body;

    // Insert a document in MongoDB
    await db.collection("data").insertOne(data);

    res.send("New data recorded in MongoDB!");
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Error processing data");
  }
});

app.get("/data", async (req, res) => {
  try {
    // Get data from MongoDB
    // Get the latest 50 data records from MongoDB
    const data = await db
      .collection("data")
      .find()
      .sort({ timestamp: 1 }) // Sort by timestamp in ascending order
      .limit(50) // Limit to 50 documents
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Error retrieving data");
  }
});
app.listen(port, () => {
  console.log(`Node.js app listening at http://localhost:${port}`);
});
