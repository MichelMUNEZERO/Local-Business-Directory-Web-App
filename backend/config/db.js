const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
try {
  dotenv.config();
} catch (err) {
  console.log("No .env file found, using defaults");
}

// Set default environment variables if not provided
process.env.DB_TYPE = process.env.DB_TYPE || "sqlite";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Create directory for SQLite database if it doesn't exist
const dbDir = path.join(__dirname, "../data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Determine which database to use based on configuration
// Default to SQLite if MySQL is not configured or available
const dbType = process.env.DB_TYPE || "sqlite";

let sequelize;

if (dbType === "mysql") {
  // MySQL configuration
  sequelize = new Sequelize(
    process.env.DB_NAME || "local_business_directory",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "Mich540el12!",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    }
  );
} else {
  // SQLite configuration
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(dbDir, "database.sqlite"),
    logging: false,
  });
}

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully using ${dbType}`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection,
  Sequelize,
};
