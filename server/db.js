
// server/db.js - Production Ready with SSL Support
require("dotenv").config();
const mysql = require("mysql2/promise");

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "admin",
  database: process.env.DB_NAME || "projectport",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
};

// Add SSL configuration for production (Aiven)
if (process.env.NODE_ENV === "production" || process.env.DB_HOST?.includes("aivencloud")) {
  dbConfig.ssl = {
    rejectUnauthorized: true, // Set to false if you don't have the CA certificate
  };
  console.log("✅ SSL enabled for production database");
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log("✅ Database connected successfully!");
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   SSL: ${dbConfig.ssl ? 'Enabled' : 'Disabled'}`);
    connection.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:");
    console.error(`   Error: ${err.message}`);
    console.error(`   Host: ${dbConfig.host}`);
    console.error(`   Database: ${dbConfig.database}`);
    console.error(`   Port: ${dbConfig.port}`);
  });

module.exports = pool;
