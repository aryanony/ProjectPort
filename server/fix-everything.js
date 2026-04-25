// server/fix-everything.js
// ONE-CLICK FIX FOR ALL ISSUES
// Run: node fix-everything.js

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function fixEverything() {
  console.log("\n🔧 ProjectPort - COMPLETE FIX SCRIPT");
  console.log("=" .repeat(70));
  
  let connection;
  
  try {
    // 1. Connect to database
    console.log("\n📡 Connecting to database...");
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "admin",
      database: process.env.DB_NAME || "projectport",
      port: Number(process.env.DB_PORT || 3306),
      charset: "utf8mb4",
    });
    console.log("✅ Connected successfully!");
    
    // 2. Generate fresh password hashes
    console.log("\n🔐 Generating password hashes...");
    const adminHash = await bcrypt.hash("admin123", 10);
    const clientHash = await bcrypt.hash("client123", 10);
    console.log("✅ Hashes generated");
    
    // 3. Fix Admin User
    console.log("\n👨‍💼 Fixing ADMIN user...");
    await connection.query(`
      UPDATE users 
      SET password = ?, is_active = TRUE 
      WHERE email = ?
    `, [adminHash, 'admin@projectport.com']);
    console.log("✅ Admin password updated");
    console.log("   Email: admin@projectport.com");
    console.log("   Password: admin123");
    
    // 4. Fix Client User
    console.log("\n👤 Fixing DEMO CLIENT user...");
    await connection.query(`
      UPDATE users 
      SET password = ?, is_active = TRUE 
      WHERE email = ?
    `, [clientHash, 'client@gmail.com']);
    console.log("✅ Client password updated");
    console.log("   Email: client@gmail.com");
    console.log("   Password: client123");
    
    // 5. Check if users exist, create if not
    console.log("\n🔍 Verifying users exist...");
    
    const [adminUsers] = await connection.query(
      "SELECT id, email FROM users WHERE email = ?",
      ['admin@projectport.com']
    );
    
    if (adminUsers.length === 0) {
      console.log("⚠️  Admin not found, creating...");
      await connection.query(`
        INSERT INTO users (email, password, full_name, phone, role, is_active)
        VALUES (?, ?, 'Aryan Gupta', '6205650368', 'admin', TRUE)
      `, ['admin@projectport.com', adminHash]);
      console.log("✅ Admin created");
    }
    
    const [clientUsers] = await connection.query(
      "SELECT id, email FROM users WHERE email = ?",
      ['client@gmail.com']
    );
    
    if (clientUsers.length === 0) {
      console.log("⚠️  Client not found, creating...");
      await connection.query(`
        INSERT INTO users (email, password, full_name, phone, company, role, is_active)
        VALUES (?, ?, 'Client Demo', '9876543211', 'Tech Corp', 'client', TRUE)
      `, ['client@gmail.com', clientHash]);
      console.log("✅ Client created");
    }
    
    // 6. Test logins
    console.log("\n" + "=".repeat(70));
    console.log("\n✅ TESTING LOGINS...\n");
    
    // Test admin login
    const [adminTest] = await connection.query(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      ['admin@projectport.com']
    );
    
    if (adminTest.length > 0) {
      const adminValid = await bcrypt.compare("admin123", adminTest[0].password);
      console.log(adminValid ? "✅ ADMIN LOGIN WORKS!" : "❌ Admin login failed");
      console.log("   Email: admin@projectport.com");
      console.log("   Password: admin123");
    }
    
    // Test client login
    const [clientTest] = await connection.query(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      ['client@gmail.com']
    );
    
    if (clientTest.length > 0) {
      const clientValid = await bcrypt.compare("client123", clientTest[0].password);
      console.log(clientValid ? "✅ CLIENT LOGIN WORKS!" : "❌ Client login failed");
      console.log("   Email: client@gmail.com");
      console.log("   Password: client123");
    }
    
    // 7. Check and display all users
    console.log("\n" + "=".repeat(70));
    console.log("\n📋 ALL USERS IN DATABASE:\n");
    
    const [allUsers] = await connection.query(
      "SELECT id, email, full_name, role, is_active FROM users ORDER BY id"
    );
    
    allUsers.forEach(user => {
      console.log(`  ${user.id}. ${user.email}`);
      console.log(`     Name: ${user.full_name}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     Active: ${user.is_active ? 'YES' : 'NO'}`);
      console.log("");
    });
    
    // 8. Display summary
    console.log("=".repeat(70));
    console.log("\n🎉 FIX COMPLETE!\n");
    console.log("You can now login with:");
    console.log("\n📧 ADMIN:");
    console.log("   Email: admin@projectport.com");
    console.log("   Password: admin123");
    console.log("\n📧 DEMO CLIENT:");
    console.log("   Email: client@gmail.com");
    console.log("   Password: client123");
    console.log("\n" + "=".repeat(70) + "\n");
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nPlease check:");
    console.error("1. MySQL is running");
    console.error("2. Database 'projectport' exists");
    console.error("3. .env file has correct credentials");
    console.error("4. User has proper permissions");
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

fixEverything();