const fs = require("fs");
const pool = require("./db");

async function setup() {
  const sql = fs.readFileSync("./database_schema.sql", "utf8");
  const statements = sql.split(";").filter((s) => s.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await pool.query(statement);
      } catch (e) {
        if (!e.message.includes("already exists")) {
          console.error("Error:", e.message);
        }
      }
    }
  }

  console.log("✅ Database setup complete!");
  process.exit(0);
}

setup();
