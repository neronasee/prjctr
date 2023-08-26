const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5050;

app.use(express.json()); // Middleware for parsing JSON data in request bodies

const connectToMongo = async () => {
  try {
    const client = await MongoClient.connect("mongodb://mongodb:27017/test");
    console.log("Connected successfully to MongoDB");
    return client.db("test");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const prepopulateData = async () => {
  try {
    const records = [];
    for (let i = 0; i < 100000; i++) {
      records.push({
        // Example data structure. You can adjust as needed.
        id: i,
        name: `Record${i}`,
        timestamp: new Date(),
      });
    }

    await db.collection("data").insertMany(records);
    console.log("Successfully prepopulated MongoDB with 100k records.");
  } catch (error) {
    console.error("Error prepopulating MongoDB:", error);
    process.exit(1);
  }
};

let db;

(async () => {
  db = await connectToMongo();

  // Check if data already exists
  const count = await db.collection("data").countDocuments();
  if (count === 0) {
    await prepopulateData();
  }
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
