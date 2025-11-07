// server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors({ origin: "https://projectsport.vercel.app/" })); // allow your dev frontend
app.use(express.json({ limit: "1mb" })); // parse JSON bodies

// small health check
app.get("/api/health", (req, res) =>
  res.json({ ok: true, now: new Date().toISOString() })
);

// return list of project types (basic)
app.get("/api/types", (req, res) => {
  // lightweight static data — optionally you can import from client priceEngine or keep server copy
  const types = [
    { key: "portfolio", label: "Portfolio / Business Website" },
    { key: "corporate", label: "Corporate / Informational Website" },
    { key: "ecommerce", label: "E-Commerce Website" },
    { key: "transactional", label: "Transactional Website" },
    { key: "saas", label: "SaaS Platform" },
    { key: "basic-app", label: "Basic Business App" },
    { key: "enterprise-app", label: "Enterprise App" },
    { key: "smart-contract", label: "Smart Contract" },
  ];
  res.json(types);
});

/**
 * POST /api/projects
 * Accepts project payload and stores in DB
 */
app.post("/api/projects", async (req, res) => {
  try {
    // basic validation (extend as needed)
    const {
      projectName,
      name,
      email,
      phone,
      company,
      typeKey,
      techStack,
      description,
      modules = [],
      addons = [],
      estimate = {},
      metadata = {},
    } = req.body;

    if (!projectName)
      return res.status(400).json({ error: "projectName is required" });
    if (!email && !phone)
      return res.status(400).json({ error: "contact email or phone required" });

    // insert
    const sql = `INSERT INTO projects 
      (project_name, client_name, client_email, client_phone, company, type_key, tech_stack, description, modules, addons, estimate, metadata, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.execute(sql, [
      projectName,
      name || null,
      email || null,
      phone || null,
      company || null,
      typeKey || null,
      techStack || null,
      description || null,
      JSON.stringify(modules || []),
      JSON.stringify(addons || []),
      JSON.stringify(estimate || {}),
      JSON.stringify(metadata || {}),
      "Submitted",
    ]);

    const insertedId = result.insertId;
    const [rows] = await pool.execute("SELECT * FROM projects WHERE id = ?", [
      insertedId,
    ]);

    res.status(201).json({ ok: true, project: rows[0] });
  } catch (err) {
    console.error("POST /api/projects error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/projects
 * Query params: ?limit=20&offset=0
 */
app.get("/api/projects", async (req, res) => {
  try {
    const limit = Math.min(100, Number(req.query.limit) || 50);
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const [rows] = await pool.execute(
      "SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    // parse JSON fields
    const parsed = rows.map((r) => ({
      ...r,
      modules: tryParseJSON(r.modules),
      addons: tryParseJSON(r.addons),
      estimate: tryParseJSON(r.estimate),
      metadata: tryParseJSON(r.metadata),
    }));
    res.json({ ok: true, projects: parsed });
  } catch (err) {
    console.error("GET /api/projects error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const [rows] = await pool.execute("SELECT * FROM projects WHERE id = ?", [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "not found" });
    const r = rows[0];
    r.modules = tryParseJSON(r.modules);
    r.addons = tryParseJSON(r.addons);
    r.estimate = tryParseJSON(r.estimate);
    r.metadata = tryParseJSON(r.metadata);
    res.json({ ok: true, project: r });
  } catch (err) {
    console.error("GET /api/projects/:id error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// helper to safely parse JSON
function tryParseJSON(val) {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on https://projectsport:${PORT}`);
});
