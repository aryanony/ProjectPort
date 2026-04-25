// const bcrypt = require('bcryptjs');
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// async function testLogin() {
//     const pool = mysql.createPool({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME
//     });

//     const [users] = await pool.query("SELECT * FROM users WHERE email = 'admin@projectport.com'");
    
//     if (users.length === 0) {
//         console.log('❌ Admin user not found');
//         return;
//     }

//     const user = users[0];
//     const isValid = await bcrypt.compare('#admin@ProjectPort', user.password);
    
//     console.log('Admin user found:', user.email);
//     console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');
    
//     if (!isValid) {
//         console.log('\n🔧 Fixing password...');
//         const newHash = await bcrypt.hash('#admin@ProjectPort', 10);
//         await pool.query("UPDATE users SET password = ? WHERE email = 'admin@projectport.com'", [newHash]);
//         console.log('✅ Password fixed! Try logging in again.');
//     }

//     pool.end();
// }

// testLogin();

// server/test-password.js
// Run this to test password hashing and verify login credentials

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "admin",
  database: process.env.DB_NAME || "projectport",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

async function testPasswords() {
  console.log("\n🔐 ProjectPort Password Testing Tool\n");
  console.log("=" .repeat(60));
  
  try {
    // 1. Generate fresh password hashes
    console.log("\n1️⃣  Generating fresh password hashes...\n");
    
    const adminPassword = "admin123";
    const clientPassword = "client123";
    
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const clientHash = await bcrypt.hash(clientPassword, 10);
    
    console.log("Admin Password: admin123");
    console.log("Admin Hash:     " + adminHash);
    console.log("\nClient Password: client123");
    console.log("Client Hash:     " + clientHash);
    
    // 2. Check database users
    console.log("\n" + "=".repeat(60));
    console.log("\n2️⃣  Checking users in database...\n");
    
    const [users] = await pool.query("SELECT id, email, full_name, role, is_active FROM users");
    
    if (users.length === 0) {
      console.log("❌ No users found in database!");
      console.log("   Run database_schema.sql to create default users");
      return;
    }
    
    console.log("Found " + users.length + " users:");
    users.forEach(user => {
      console.log(`  • ${user.email} (${user.role}) - ${user.full_name} - Active: ${user.is_active}`);
    });
    
    // 3. Test admin login
    console.log("\n" + "=".repeat(60));
    console.log("\n3️⃣  Testing ADMIN login...\n");
    
    const [adminUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      ['admin@projectport.com']
    );
    
    if (adminUsers.length === 0) {
      console.log("❌ Admin user not found or inactive!");
      console.log("\nFix: Run this SQL command:");
      console.log(`INSERT INTO users (email, password, full_name, phone, role) VALUES
('admin@projectport.com', '${adminHash}', 'Aryan Gupta', '6205650368', 'admin')
ON DUPLICATE KEY UPDATE password = '${adminHash}', is_active = TRUE;`);
    } else {
      const admin = adminUsers[0];
      const validAdminPass = await bcrypt.compare(adminPassword, admin.password);
      
      if (validAdminPass) {
        console.log("✅ Admin login WORKING!");
        console.log("   Email: admin@projectport.com");
        console.log("   Password: admin123");
      } else {
        console.log("❌ Admin password MISMATCH!");
        console.log("\nFix: Run this SQL command:");
        console.log(`UPDATE users SET password = '${adminHash}' WHERE email = 'admin@projectport.com';`);
      }
    }
    
    // 4. Test client login
    console.log("\n" + "=".repeat(60));
    console.log("\n4️⃣  Testing CLIENT login...\n");
    
    const [clientUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      ['client@gmail.com']
    );
    
    if (clientUsers.length === 0) {
      console.log("❌ Demo client user not found or inactive!");
      console.log("\nFix: Run this SQL command:");
      console.log(`INSERT INTO users (email, password, full_name, phone, company, role) VALUES
('client@gmail.com', '${clientHash}', 'Client Demo', '9876543211', 'Tech Corp', 'client')
ON DUPLICATE KEY UPDATE password = '${clientHash}', is_active = TRUE;`);
    } else {
      const client = clientUsers[0];
      const validClientPass = await bcrypt.compare(clientPassword, client.password);
      
      if (validClientPass) {
        console.log("✅ Client login WORKING!");
        console.log("   Email: client@gmail.com");
        console.log("   Password: client123");
      } else {
        console.log("❌ Client password MISMATCH!");
        console.log("\nFix: Run this SQL command:");
        console.log(`UPDATE users SET password = '${clientHash}' WHERE email = 'client@gmail.com';`);
      }
    }
    
    // 5. Test password comparison with stored hashes
    console.log("\n" + "=".repeat(60));
    console.log("\n5️⃣  Testing stored password hashes...\n");
    
    const storedAdminHash = '$2b$10$H2OGi5T7IwHniXuEnkEqS.Ng0o6Q8tm4kgQX1nQxEVCkAWc8p9nUS';
    const storedClientHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL2lQ4S2';
    
    const adminHashValid = await bcrypt.compare('admin123', storedAdminHash);
    const clientHashValid = await bcrypt.compare('client123', storedClientHash);
    
    console.log(`Stored admin hash validates: ${adminHashValid ? '✅' : '❌'}`);
    console.log(`Stored client hash validates: ${clientHashValid ? '✅' : '❌'}`);
    
    // 6. Summary
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 SUMMARY\n");
    
    if (adminHashValid && clientHashValid) {
      console.log("✅ All password hashes are CORRECT!");
      console.log("\nIf login still fails, check:");
      console.log("  1. Server is running: node index.js");
      console.log("  2. Database connection in .env file");
      console.log("  3. CORS settings in index.js");
      console.log("  4. Browser console for errors");
      console.log("  5. Network tab to see API requests");
    } else {
      console.log("⚠️  Password hash issues detected!");
      console.log("\nRun the SQL commands above to fix.");
    }
    
    console.log("\n" + "=".repeat(60) + "\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nCheck your database connection settings in .env file");
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testPasswords();