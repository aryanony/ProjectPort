require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/projectport",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
  SITE_URL: process.env.SITE_URL || "http://localhost:5173"
};
