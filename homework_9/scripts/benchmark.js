const mysql = require("mysql");

const dbConfig = {
  host: "mysql",
  user: "root",
  port: 3306,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

async function executeQuery(connection, query) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      resolve({ elapsedTime, results });
    });
  });
}

async function runBenchmark(query, queryType, concurrency, durationInMs) {
  const connection = mysql.createConnection(dbConfig);

  try {
    console.log(
      `Running benchmark for '${queryType}' with ${concurrency} concurrent requests...`
    );

    const promises = Array.from({ length: concurrency }, () =>
      executeQuery(connection, query)
    );
    const start = Date.now();

    // Execute queries in parallel using Promise.all
    const results = await Promise.all(promises);

    const end = Date.now();
    const elapsedTime = end - start;
    const totalQueries = concurrency;
    const totalResults = results.reduce(
      (total, { results }) => total + results.length,
      0
    );

    const avgResponseTime = elapsedTime / totalQueries;
    const queriesPerSecond = (totalQueries * 1000) / elapsedTime;

    console.log(`Benchmark for '${queryType}' completed.`);
    console.log(`Total execution time: ${elapsedTime}ms`);
    console.log(`Average query response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Total results: ${totalResults}`);
    console.log(`Queries per second (QPS): ${queriesPerSecond.toFixed(2)}`);

    // Close the database connection
    connection.end();
  } catch (error) {
    console.error("Error:", error);
    connection.end();
  }
}

async function addIndex(connection, indexName, indexQuery) {
  console.log(`Adding ${indexName} index...`);
  await new Promise((resolve, reject) => {
    connection.query(indexQuery, (error, results) => {
      if (error) return reject(error);
      console.log(`Index ${indexName} added successfully.`);
      resolve(results);
    });
  });
}

async function dropIndex(connection, indexName) {
  console.log(`Dropping ${indexName} index...`);
  try {
    await new Promise((resolve, reject) => {
      const dropQuery = `ALTER TABLE Users DROP INDEX ${indexName}`;
      connection.query(dropQuery, (error, results) => {
        if (error) return reject(error);
        console.log(`Index ${indexName} dropped successfully.`);
        resolve(results);
      });
    });
  } catch (error) {
    if (error.code === "ER_CANT_DROP_FIELD_OR_KEY") {
      console.log("Index does not exist");
    } else {
      throw error;
    }
  }
}

async function runBenchmarks(prefix) {
  // Define benchmark parameters
  const concurrency = 10; // Number of concurrent requests
  const durationInMs = 60000; // Duration of the benchmark in milliseconds (1 minute)

  const queries = {
    exactMatch:
      "SELECT * FROM Users WHERE birth_date = '2000-01-01' LIMIT 10000",
    comparrison:
      "SELECT * FROM Users WHERE birth_date > '2000-01-01' LIMIT 10000",
    highSelectivity:
      "SELECT * FROM Users WHERE birth_date BETWEEN '2000-01-01' AND '2000-01-31' LIMIT 10000",
    smallSelectivity:
      "SELECT * FROM Users WHERE birth_date BETWEEN '2000-01-01' AND '2005-01-31' LIMIT 10000",
  };

  await runBenchmark(
    queries.exactMatch,
    `${prefix}: Exact match`,
    concurrency,
    durationInMs
  );
  await runBenchmark(
    queries.comparrison,
    `${prefix}: Comparrison`,
    concurrency,
    durationInMs
  );
  await runBenchmark(
    queries.highSelectivity,
    `${prefix}: High selectivity`,
    concurrency,
    durationInMs
  );
  await runBenchmark(
    queries.smallSelectivity,
    `${prefix}: Small match`,
    concurrency,
    durationInMs
  );
}

async function main() {
  const connection = mysql.createConnection(dbConfig);

  try {
    // Drop indexes if they exist
    await dropIndex(connection, "idx_birth_date");
    await dropIndex(connection, "idx_birth_date_hash");

    // Run benchmarks without indexes
    console.log("Benchmarks without indexes");
    await runBenchmarks("Without index");

    // Add BTREE index and run benchmarks
    const btreeIndexQuery =
      "ALTER TABLE Users ADD INDEX idx_birth_date (birth_date)";
    await addIndex(connection, "idx_birth_date", btreeIndexQuery);

    // Run benchmarks without indexes
    console.log("Benchmarks with Btree index");
    await runBenchmarks("With Btree index");

    // Drop Btree index before testing HASH
    await dropIndex(connection, "idx_birth_date");

    // Add HASH index and run benchmarks
    const hashIndexQuery =
      "ALTER TABLE Users ADD INDEX idx_birth_date_hash (birth_date) USING HASH";
    await addIndex(connection, "idx_birth_date_hash", hashIndexQuery);

    // Run benchmarks without indexes
    console.log("Benchmarks with Hash index");
    await runBenchmarks("With Hash index");

    console.log("Benchmark finished. Exiting...");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the database connection
    connection.end();
    process.exit();
  }
}

main();
