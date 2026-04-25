// ===== FILE 12: server/seed.js =====
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config/env");
const User = require("./models/User");

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Seed admin user
    // Note: password is auto-hashed by User model pre-save hook
    const admin = await User.findOne({ email: "admin@projectport.com" });
    if (!admin) {
      await User.create({
        email: "admin@projectport.com",
        password: "admin123",
        full_name: "Admin User",
        role: "admin",
        is_active: true
      });
      console.log("✅ Admin user created: admin@projectport.com / admin123");
    } else {
      console.log("ℹ️  Admin user already exists, skipping.");
    }

    // Seed demo client user
    const client = await User.findOne({ email: "client@gmail.com" });
    if (!client) {
      await User.create({
        email: "client@gmail.com",
        password: "client123",
        full_name: "Demo Client",
        role: "client",
        is_active: true
      });
      console.log("✅ Client user created: client@gmail.com / client123");
    } else {
      console.log("ℹ️  Client user already exists, skipping.");
    }

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
