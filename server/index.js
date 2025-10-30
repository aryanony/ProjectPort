// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: CLIENT_ORIGIN }));

// Health
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// Create project
app.post("/api/projects", async (req, res) => {
  const payload = req.body || {};

  // basic validation
  if (
    !payload.projectName ||
    !payload.name ||
    !payload.email ||
    !payload.phone
  ) {
    return res
      .status(400)
      .json({
        ok: false,
        error: "projectName, name, email and phone are required",
      });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const now = new Date();
      const sql = `
        INSERT INTO projects
          (project_name, client_name, client_email, client_phone, company, type_key, type_label, tech_stack,
           description, estimate_final, estimate_json, addons, modules, resources, hosting, cms, budget, estimated_weeks,
           status, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const estimateFinal = payload.estimate?.final || null;
      const estimateJson = JSON.stringify(payload.estimate || {});
      const addons = JSON.stringify(
        payload.addons || payload.addonsApplied || []
      );
      const modules = JSON.stringify(payload.modules || []);
      const resources = JSON.stringify(payload.resources || []);

      const params = [
        payload.projectName,
        payload.name,
        payload.email,
        payload.phone,
        payload.company || null,
        payload.typeKey || null,
        payload.typeLabel || null,
        payload.techStack || null,
        payload.description || null,
        estimateFinal,
        estimateJson,
        addons,
        modules,
        resources,
        payload.hosting || null,
        payload.cms || null,
        payload.budget || null,
        payload.estimatedTimeWeeks || null,
        payload.status || "Submitted",
        now,
      ];

      const [result] = await conn.query(sql, params);
      const insertedId = result.insertId;

      // return the saved record
      const [rows] = await conn.query("SELECT * FROM projects WHERE id = ?", [
        insertedId,
      ]);
      const saved = rows[0] || null;

      res.json({ ok: true, project: saved });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("POST /api/projects error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// List projects (most recent first)
app.get("/api/projects", async (req, res) => {
  const limit = Math.min(200, Number(req.query.limit || 100));
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    res.json({ ok: true, projects: rows });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Get single project
app.get("/api/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  try {
    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, project: rows[0] });
  } catch (err) {
    console.error("GET /api/projects/:id error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(
    `API server running on http://localhost:${PORT} (CORS allowed: ${CLIENT_ORIGIN})`
  );
});
