const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mich540el12!", // Update with your actual MySQL password if needed
  database: "local_business_directory",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};
