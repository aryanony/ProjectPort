// ===== FILE 2: server/db.js =====
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config/env");

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
}

// Auto-connect on import
connectDB();

module.exports = connectDB;
