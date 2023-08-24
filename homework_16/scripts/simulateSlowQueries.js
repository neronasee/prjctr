const mysql = require("mysql");

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  port: 3306,
  password: "root",
  database: "test_db",
});

// Function to simulate a long query with random sleep time
const simulateLongQuery = () => {
  const sleepTime = Math.floor(Math.random() * 5); // Random sleep time between 0 and 15 seconds

  return new Promise((resolve, reject) => {
    connection.query(`SELECT SLEEP(${sleepTime})`, (error, results) => {
      if (error) reject(error);
      console.log(`Long query completed after ${sleepTime} seconds`);
      resolve();
    });
  });
};

connection.connect((error) => {
  if (error) throw error;
  console.log("Connected to MySQL");

  const startTime = Date.now();
  const duration = 100 * 1000;
  const maxParallelQueries = 20;
  let queriesExecuted = 0;

  const executeNextQuery = async () => {
    console.log("executing new query");
    if (
      Date.now() - startTime < duration &&
      queriesExecuted < maxParallelQueries
    ) {
      queriesExecuted++;
      simulateLongQuery()
        .then(() => {
          queriesExecuted--;
          executeNextQuery();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          queriesExecuted--;
          executeNextQuery();
        });
      executeNextQuery();
    } else if (queriesExecuted === 0) {
      connection.end();
    }
  };

  executeNextQuery();
});
