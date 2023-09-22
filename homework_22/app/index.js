const { Client } = require("pg");

const notPartitionedPgConfig = {
  user: "postgres",
  host: "postgres",
  database: "postgres",
  password: "postgres",
  port: 5432,
};

const partitionedPgConfig = {
  user: "postgres",
  host: "postgres-partitioned",
  database: "postgres",
  password: "postgres",
  port: 5432,
};

const citusPgConfig = {
  user: "postgres",
  host: "citus-master",
  database: "postgres",
  password: "postgres",
  port: 5432,
};

let client;

function setClient(config) {
  client = new Client(config);
}

async function insertFixedNumberOfRecords(recordsCount) {
  console.log(`Inserting ${recordsCount} records...`);

  for (let count = 0; count < recordsCount; count += 10) {
    const values = [];
    const placeholders = [];

    for (let i = 0; i < 10 && count + i < recordsCount; i++) {
      const categoryId = Math.floor(Math.random() * 4) + 1;
      values.push(`Name ${count + i}`, `Description ${count + i}`, categoryId);
      placeholders.push(`($${3 * i + 1}, $${3 * i + 2}, $${3 * i + 3})`);
    }

    const insertSQL = `
            INSERT INTO test_table (name, description, category_id)
            VALUES ${placeholders.join(", ")}
        `;

    await client.query(insertSQL, values);

    if ((count + 10) % 10000 === 0) {
      console.log(`${count + 10} records inserted...`);
    }
  }

  console.log("Insert completed.");
}

async function insertRecordsForDuration(duration) {
  console.log(`Inserting records for ${duration / 1000} seconds...`);
  const startTime = Date.now();
  let count = 0;

  while (Date.now() - startTime < duration) {
    const values = [];
    const placeholders = [];

    for (let i = 0; i < 10; i++) {
      const categoryId = Math.floor(Math.random() * 4) + 1;
      values.push(`Name ${count}`, `Description ${count}`, categoryId);
      placeholders.push(`($${3 * i + 1}, $${3 * i + 2}, $${3 * i + 3})`);
      count++;
    }

    const insertSQL = `
          INSERT INTO test_table (name, description, category_id)
          VALUES ${placeholders.join(", ")}
      `;

    await client.query(insertSQL, values);
  }

  console.log(`Inserted ${count} records in ${duration / 1000} seconds.`);
  return count;
}

async function runRawSQL(sql, values = []) {
  console.log("Executing raw SQL...");
  const res = await client.query(sql, values);
  console.log("SQL executed successfully.");
  return res;
}

async function measureInsertOpsPerSecond(duration) {
  console.log(`Measuring insert ops/sec for ${duration / 1000} seconds...`);
  const startTime = Date.now();
  const resultCount = await insertRecordsForDuration(duration);
  const endTime = Date.now();

  const opsPerSec = resultCount / ((endTime - startTime) / 1000);
  console.log(`Ops/sec: ${opsPerSec}`);
  return opsPerSec;
}

async function measureReadsPerSecond(durationMs) {
  let results = [];
  const startTime = Date.now();

  while (Date.now() - startTime < durationMs) {
    const categoryId = Math.floor(Math.random() * 4) + 1;
    const readSQL = `SELECT * FROM test_table WHERE category_id = $1 LIMIT 1;`;
    const res = await client.query(readSQL, [categoryId]);
    results.push(res.rows[0]);
  }

  const endTime = Date.now();
  const durationSeconds = (endTime - startTime) / 1000;
  const readsPerSecond = results.length / durationSeconds;

  console.log(`Reads per second: ${readsPerSecond}`);
  return results;
}

async function runBehcmark() {
  await insertFixedNumberOfRecords(1000000);
  await measureInsertOpsPerSecond(60000);
  await measureReadsPerSecond(60000);
}

(async () => {
  try {
    console.log("---Not partitioned test START---");
    setClient(notPartitionedPgConfig);
    await client.connect();
    console.log("Connected to the database.");
    await runRawSQL(`
    CREATE TABLE IF NOT EXISTS test_table (
        id serial PRIMARY KEY,
        name text NOT NULL,
        description text,
        category_id int CHECK (category_id >= 1 AND category_id <= 4)
    );
        `);
    await runBehcmark();
    await client.end();
    console.log("Disconnected from the database.");
    console.log("---Not partitioned test END---");

    console.log("---Partitioned test START---");
    setClient(partitionedPgConfig);
    await client.connect();
    console.log("Connected to the database.");
    await runRawSQL(`
    CREATE TABLE IF NOT EXISTS test_table (
        id serial PRIMARY KEY,
        name text NOT NULL,
        description text,
        category_id int CHECK (category_id >= 1 AND category_id <= 4)
    );
        `);
    await runRawSQL(`
        -- Creating child tables for each category
        CREATE TABLE test_table_0
        (CHECK (category_id = 1))
        INHERITS (test_table);
        CREATE TABLE test_table_1
        (CHECK (category_id = 2))
        INHERITS (test_table);
        CREATE TABLE test_table_2
        (CHECK (category_id = 3))
        INHERITS (test_table);
        CREATE TABLE test_table_3
        (CHECK (category_id = 4))
        INHERITS (test_table);
        -- Creating rules to redirect inserts to the appropriate child table
        CREATE RULE test_table_insert_to_category_0 AS
        ON INSERT TO test_table
        WHERE (category_id = 1)
        DO INSTEAD INSERT INTO test_table_0 VALUES (NEW.*);
        CREATE RULE test_table_insert_to_category_1 AS
        ON INSERT TO test_table
        WHERE (category_id = 2)
        DO INSTEAD INSERT INTO test_table_1 VALUES (NEW.*);
        CREATE RULE test_table_insert_to_category_2 AS
        ON INSERT TO test_table
        WHERE (category_id = 3)
        DO INSTEAD INSERT INTO test_table_2 VALUES (NEW.*);
        CREATE RULE test_table_insert_to_category_3 AS
        ON INSERT TO test_table
        WHERE (category_id = 4)
        DO INSTEAD INSERT INTO test_table_3 VALUES (NEW.*);
        `);
    await runBehcmark();
    await client.end();
    console.log("Disconnected from the database.");
    console.log("---Partitioned test END---");

    console.log("---Citus test START---");
    setClient(citusPgConfig);
    await client.connect();
    console.log("Connected to the database.");
    await runRawSQL(`
    CREATE EXTENSION IF NOT EXISTS citus;

    CREATE TABLE IF NOT EXISTS test_table (
        id serial,
        name text NOT NULL,
        description text,
        category_id int CHECK (category_id >= 1 AND category_id <= 4),
        PRIMARY KEY (id, category_id)
    );

    SELECT create_distributed_table('test_table', 'category_id')
        `);
    await runBehcmark();

    await client.end();
    console.log("Disconnected from the database.");
    console.log("---Citus test END---");
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
})();
