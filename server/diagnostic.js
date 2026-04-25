// diagnostic.js - Run this to check your database structure
require("dotenv").config();
const mysql = require("mysql2/promise");

async function runDiagnostics() {
  console.log("🔍 Starting ProjectPort Database Diagnostics...\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "admin",
    database: process.env.DB_NAME || "projectport",
    port: Number(process.env.DB_PORT || 3306),
  });

  try {
    // 1. Check projects table structure
    console.log("📋 Checking PROJECTS table structure:");
    console.log("=".repeat(60));
    const [columns] = await connection.query("DESCRIBE projects");

    console.log("\nColumns in projects table:");
    columns.forEach((col, idx) => {
      console.log(
        `${idx + 1}. ${col.Field} (${col.Type}) ${
          col.Null === "NO" ? "NOT NULL" : "NULL"
        } ${col.Default ? `DEFAULT ${col.Default}` : ""}`
      );
    });

    // 2. Count columns
    const columnCount = columns.length;
    const autoColumns = columns.filter(
      (c) =>
        c.Extra.includes("auto_increment") || c.Default === "CURRENT_TIMESTAMP"
    ).length;
    const manualColumns = columnCount - autoColumns;

    console.log(`\n✅ Total columns: ${columnCount}`);
    console.log(`   Auto columns (id, timestamps): ${autoColumns}`);
    console.log(`   Manual insert columns: ${manualColumns}`);

    // 3. Check leads table
    console.log("\n\n📋 Checking LEADS table structure:");
    console.log("=".repeat(60));
    const [leadColumns] = await connection.query("DESCRIBE leads");
    console.log("\nColumns in leads table:");
    leadColumns.forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.Field} (${col.Type})`);
    });

    // 4. Check users table
    console.log("\n\n📋 Checking USERS table structure:");
    console.log("=".repeat(60));
    const [userColumns] = await connection.query("DESCRIBE users");
    console.log("\nColumns in users table:");
    userColumns.forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.Field} (${col.Type})`);
    });

    // 5. Check for existing data
    console.log("\n\n📊 Data Summary:");
    console.log("=".repeat(60));

    const [leadCount] = await connection.query(
      "SELECT COUNT(*) as count FROM leads"
    );
    console.log(`Leads: ${leadCount[0].count}`);

    const [userCount] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log(`Users: ${userCount[0].count}`);

    const [projectCount] = await connection.query(
      "SELECT COUNT(*) as count FROM projects"
    );
    console.log(`Projects: ${projectCount[0].count}`);

    // 6. Show recent leads
    console.log("\n\n📝 Recent Leads (last 5):");
    console.log("=".repeat(60));
    const [recentLeads] = await connection.query(
      "SELECT id, full_name, email, project_name, status, created_at FROM leads ORDER BY created_at DESC LIMIT 5"
    );

    if (recentLeads.length === 0) {
      console.log("No leads found.");
    } else {
      recentLeads.forEach((lead) => {
        console.log(`\nID: ${lead.id}`);
        console.log(`  Name: ${lead.full_name}`);
        console.log(`  Email: ${lead.email}`);
        console.log(`  Project: ${lead.project_name}`);
        console.log(`  Status: ${lead.status}`);
        console.log(`  Created: ${lead.created_at}`);
      });
    }

    // 7. Show users
    console.log("\n\n👥 All Users:");
    console.log("=".repeat(60));
    const [allUsers] = await connection.query(
      "SELECT id, email, full_name, role, is_active FROM users ORDER BY id"
    );

    if (allUsers.length === 0) {
      console.log("No users found.");
    } else {
      allUsers.forEach((user) => {
        console.log(`\nID: ${user.id}`);
        console.log(`  Name: ${user.full_name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Active: ${user.is_active ? "Yes" : "No"}`);
      });
    }

    // 8. Check for converted leads
    console.log("\n\n🔄 Converted Leads:");
    console.log("=".repeat(60));
    const [convertedLeads] = await connection.query(
      `SELECT l.id, l.full_name, l.email, l.status, l.converted_user_id, u.email as user_email
       FROM leads l
       LEFT JOIN users u ON l.converted_user_id = u.id
       WHERE l.status = 'converted'
       ORDER BY l.converted_at DESC
       LIMIT 5`
    );

    if (convertedLeads.length === 0) {
      console.log("No converted leads found.");
    } else {
      convertedLeads.forEach((lead) => {
        console.log(`\nLead ID: ${lead.id} (${lead.full_name})`);
        console.log(`  Lead Email: ${lead.email}`);
        console.log(`  Converted to User ID: ${lead.converted_user_id}`);
        console.log(`  User Email: ${lead.user_email || "N/A"}`);
      });
    }

    // 9. Test INSERT statement
    console.log("\n\n🧪 Testing INSERT Statement Structure:");
    console.log("=".repeat(60));
    console.log("\nThe INSERT for projects table should have 17 values:");
    console.log("1. project_name");
    console.log("2. client_id");
    console.log("3. type_key");
    console.log("4. type_label");
    console.log("5. tech_stack");
    console.log("6. description");
    console.log("7. budget");
    console.log("8. estimate_final");
    console.log("9. estimate_json");
    console.log("10. modules");
    console.log("11. addons");
    console.log("12. resources");
    console.log("13. hosting");
    console.log("14. cms");
    console.log("15. estimated_weeks");
    console.log("16. status");
    console.log("17. priority");
    console.log("\nColumns NOT in INSERT (will use defaults):");
    console.log("- id (auto_increment)");
    console.log("- start_date (NULL by default)");
    console.log("- end_date (NULL by default)");
    console.log("- created_at (CURRENT_TIMESTAMP)");
    console.log("- updated_at (CURRENT_TIMESTAMP)");

    console.log("\n\n✅ Diagnostics Complete!");
    console.log("=".repeat(60));
  } catch (err) {
    console.error("\n❌ Diagnostic Error:", err.message);
    console.error("SQL State:", err.sqlState);
    console.error("SQL Message:", err.sqlMessage);
  } finally {
    await connection.end();
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);
