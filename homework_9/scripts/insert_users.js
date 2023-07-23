const { faker } = require("@faker-js/faker");
const mysql = require("mysql");

const dbConfig = {
  host: "mysql",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const totalUsers = 40000000;
const batchSize = 5000; // Number of users to insert in each batch

function generateUsers(batchSize) {
  const users = [];
  for (let i = 0; i < batchSize; i++) {
    users.push([
      faker.person.firstName(),
      faker.date.birthdate(), // Generate random date of birth
      // Add other user fields as needed
    ]);
  }
  return users;
}

async function insertUsersBatch(connection, users) {
  const query = "INSERT INTO Users (name, birth_date) VALUES ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [users], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

async function insertUsers(flushLogSetting, usersAmountToInsert, connection) {
  const startTime = Date.now(); // Record start time

  let insertedCount = 0;

  await new Promise((resolve, reject) => {
    const setVariableQuery = `SET GLOBAL innodb_flush_log_at_trx_commit = ${flushLogSetting}`;
    connection.query(setVariableQuery, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  while (insertedCount < usersAmountToInsert) {
    const remainingUsers = usersAmountToInsert - insertedCount;
    const currentBatchSize = Math.min(remainingUsers, batchSize);
    const usersBatch = generateUsers(currentBatchSize);
    await insertUsersBatch(connection, usersBatch);
    insertedCount += currentBatchSize;
  }

  const endTime = Date.now(); // Record end time
  const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
  const qps = usersAmountToInsert / timeTaken;

  console.log(`Estimated QPS for flush_log_setting ${flushLogSetting}: ${qps}`);
}

async function main() {
  //   await new Promise((resolve) => setTimeout(resolve, 5000));

  const connection = mysql.createConnection(dbConfig);

  // Create the Users table if it doesn't exist
  const createTableQuery = `CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    birth_date DATE
  )`;
  await new Promise((resolve, reject) => {
    connection.query(createTableQuery, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  const usersToInsertPerDifferentFlushLogSettings = parseInt(totalUsers / 3);

  await insertUsers(0, usersToInsertPerDifferentFlushLogSettings, connection);
  await insertUsers(1, usersToInsertPerDifferentFlushLogSettings, connection);
  await insertUsers(2, usersToInsertPerDifferentFlushLogSettings, connection);

  connection.end();
}

main().catch((error) => {
  console.error("Error:", error);
});
