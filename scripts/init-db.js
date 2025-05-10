const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: "Mich540el12!", // Update this with your actual MySQL password
  multipleStatements: true, // Enable running multiple statements at once
};

// SQL statements to create database and tables
const createDatabaseSQL = `
CREATE DATABASE IF NOT EXISTS ${
  process.env.DB_NAME || "local_business_directory"
};
`;

const useDatabaseSQL = `
USE ${process.env.DB_NAME || "local_business_directory"};
`;

const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  image_url VARCHAR(255),
  category_id INT NOT NULL,
  location_id INT NOT NULL,
  user_id INT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

// Insert default admin user
const insertAdminSQL = `
INSERT INTO users (name, email, password, role)
SELECT 'Admin', 'admin@example.com', '$2b$10$qFkG7.0Rfx83HA/dVDSU4O5UvGcwKB8xHJUYwXA0CLUVjGYv7iCmy', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');
`;

// Insert sample categories
const insertCategoriesSQL = `
INSERT INTO categories (name) VALUES
('Salon & Beauty'),
('Restaurants & Food'),
('Retail & Shopping'),
('Health & Medical'),
('Repair Services'),
('Education'),
('Transportation'),
('Technology'),
('Financial Services'),
('Entertainment')
ON DUPLICATE KEY UPDATE name = VALUES(name);
`;

// Insert sample locations
const insertLocationsSQL = `
INSERT INTO locations (name) VALUES
('Nyarugenge'),
('Kicukiro'),
('Gasabo'),
('Huye'),
('Musanze'),
('Rubavu'),
('Muhanga'),
('Rusizi'),
('Nyagatare'),
('Rwamagana')
ON DUPLICATE KEY UPDATE name = VALUES(name);
`;

// Initialize database
async function initDatabase() {
  let connection;

  try {
    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: dbConfig.multipleStatements,
    });

    console.log("Connected to MySQL server");

    // Create database
    await connection.query(createDatabaseSQL);
    console.log(
      `Database '${
        process.env.DB_NAME || "local_business_directory"
      }' created or already exists`
    );

    // Use the database
    await connection.query(useDatabaseSQL);
    console.log(
      `Using database '${process.env.DB_NAME || "local_business_directory"}'`
    );

    // Create tables
    await connection.query(createTablesSQL);
    console.log("Tables created or already exist");

    // Insert default admin user
    await connection.query(insertAdminSQL);
    console.log("Default admin user created or already exists");

    // Insert sample categories
    await connection.query(insertCategoriesSQL);
    console.log("Sample categories inserted");

    // Insert sample locations
    await connection.query(insertLocationsSQL);
    console.log("Sample locations inserted");

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// Run the initialization
initDatabase();
