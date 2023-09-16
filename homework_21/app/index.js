const mysql = require("mysql");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "mysql_master", // replace with your master node host
  user: "root", // your MySQL username
  port: 3306,
  password: "111", // your MySQL password
  database: "mydb", // your database name
});

connection.connect((err) => {
  if (err) {
    console.log({ err });
    console.error("Error connecting to the database:", err.stack);
    return process.exit(1);
  }
  console.log("Connected to the database.");

  // Create the table if it doesn't exist
  createTable();
});

// Function to create the table
function createTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL
    );
  `;

  connection.query(createTableSQL, (err, results) => {
    if (err) {
      console.error("Error creating table:", err.stack);
      return;
    }
    console.log('Table "users" is ready.');
  });
}

// Function to insert data
function insertData() {
  const data = {
    name: "John",
    lastname: "Doe",
    status: `${Math.random()}_status`, // Example status, you can change as needed
  };

  connection.query("INSERT INTO users SET ?", data, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err.stack);
      return;
    }
    console.log("Data inserted:", results.insertId);
  });
}

// Call insertData function every 10 seconds
setInterval(insertData, 1000);
