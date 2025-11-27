// server/index.js - FINAL 100% WORKING VERSION
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, error: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.query(
      "SELECT id, email, full_name, role, phone, company FROM users WHERE id = ? AND is_active = TRUE",
      [decoded.id]
    );

    if (!users.length)
      return res.status(401).json({ ok: false, error: "Invalid token" });
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ ok: false, error: "Admin only" });
  }
  next();
};

// AUTH ROUTES
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "Email and password required" });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        company: user.company,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// LEADS ROUTES
app.post("/api/leads", async (req, res) => {
  try {
    const {
      projectName,
      name,
      email,
      phone,
      company,
      typeKey,
      typeLabel,
      techStack,
      description,
      budget,
      estimate,
      modules,
      addons,
      resources,
      hosting,
      cms,
      estimatedTimeWeeks,
    } = req.body;

    if (!projectName || !name || !email || !phone) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO leads (project_name, full_name, email, phone, company, type_key, type_label, tech_stack, description, budget, estimate_json, modules, addons, resources, hosting, cms, estimated_weeks, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        projectName,
        name,
        email,
        phone,
        company || null,
        typeKey,
        typeLabel,
        techStack || null,
        description || null,
        budget || 0,
        JSON.stringify(estimate || {}),
        JSON.stringify(modules || []),
        JSON.stringify(addons || []),
        JSON.stringify(resources || []),
        hosting || null,
        cms || null,
        estimatedTimeWeeks || 4,
      ]
    );

    res.json({
      ok: true,
      leadId: result.insertId,
      message: "Thank you! We'll contact you within 24 hours.",
    });
  } catch (err) {
    console.error("Create lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to submit inquiry" });
  }
});

app.get("/api/leads", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [leads] = await pool.query(
      "SELECT * FROM leads ORDER BY created_at DESC LIMIT 200"
    );
    res.json({ ok: true, leads });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to fetch leads" });
  }
});

// CONVERT LEAD TO CLIENT - FIXED
app.post(
  "/api/leads/:id/convert",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const { password } = req.body;

      if (!password || password.length < 6) {
        await connection.rollback();
        return res
          .status(400)
          .json({ ok: false, error: "Password must be at least 6 characters" });
      }

      // Get lead
      const [leads] = await connection.query(
        "SELECT * FROM leads WHERE id = ?",
        [req.params.id]
      );
      if (!leads.length) {
        await connection.rollback();
        return res.status(404).json({ ok: false, error: "Lead not found" });
      }

      const lead = leads[0];

      // Check if already converted
      if (lead.status === "converted") {
        await connection.rollback();
        return res
          .status(400)
          .json({ ok: false, error: "Lead already converted" });
      }

      // Check if user exists
      const [existingUsers] = await connection.query(
        "SELECT id, email, full_name, role FROM users WHERE email = ?",
        [lead.email]
      );
      if (existingUsers.length > 0) {
        await connection.rollback();
        return res
          .status(400)
          .json({
            ok: false,
            error: `User with email ${lead.email} already exists`,
          });
      }

      // Create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await connection.query(
        "INSERT INTO users (email, password, full_name, phone, company, role, is_active) VALUES (?, ?, ?, ?, ?, 'client', TRUE)",
        [
          lead.email,
          hashedPassword,
          lead.full_name,
          lead.phone || null,
          lead.company || null,
        ]
      );

      const userId = userResult.insertId;

      // Parse estimate
      let estimateFinal = lead.budget || 0;
      try {
        if (lead.estimate_json) {
          const estimateData =
            typeof lead.estimate_json === "string"
              ? JSON.parse(lead.estimate_json)
              : lead.estimate_json;
          estimateFinal = estimateData.final || lead.budget || 0;
        }
      } catch (e) {
        console.log("Parse estimate error:", e);
      }

      // Create project - THIS IS THE KEY FIX
      // Ensure ALL values are properly set, no undefined
      const projectValues = [
        lead.project_name || "Untitled Project", // 1
        userId, // 2
        lead.type_key || null, // 3
        lead.type_label || null, // 4
        lead.tech_stack || null, // 5
        lead.description || null, // 6
        lead.budget || 0, // 7
        estimateFinal, // 8
        lead.estimate_json ? JSON.stringify(lead.estimate_json) : null, // 9
        lead.modules ? JSON.stringify(lead.modules) : null, // 10
        lead.addons ? JSON.stringify(lead.addons) : null, // 11
        lead.resources ? JSON.stringify(lead.resources) : null, // 12
        lead.hosting || null, // 13
        lead.cms || null, // 14
        lead.estimated_weeks || 4, // 15
        "approved", // 16
        "medium", // 17
      ];

      console.log("Creating project with values:", projectValues);

      const [projectResult] = await connection.query(
        `INSERT INTO projects (project_name, client_id, type_key, type_label, tech_stack, description, budget, estimate_final, estimate_json, modules, addons, resources, hosting, cms, estimated_weeks, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        projectValues
      );

      const projectId = projectResult.insertId;

      // Update lead
      await connection.query(
        "UPDATE leads SET status = 'converted', converted_user_id = ?, converted_at = NOW() WHERE id = ?",
        [userId, req.params.id]
      );

      // Create notification for client
      await connection.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'success', ?)",
        [
          userId,
          "Welcome to ProjectPort!",
          `Your project "${lead.project_name}" is now approved.`,
          `/client/projects/${projectId}`,
        ]
      );

      await connection.commit();

      res.json({
        ok: true,
        message: "Lead converted successfully!",
        user: {
          id: userId,
          email: lead.email,
          full_name: lead.full_name,
          password: password,
        },
        project: { id: projectId, name: lead.project_name },
      });
    } catch (err) {
      await connection.rollback();
      console.error("Convert error:", err);
      console.error("Error message:", err.message);
      console.error("SQL:", err.sql);
      res
        .status(500)
        .json({ ok: false, error: "Failed to convert: " + err.message });
    } finally {
      connection.release();
    }
  }
);

// Delete lead
app.delete("/api/leads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query("DELETE FROM leads WHERE id = ?", [req.params.id]);
    res.json({ ok: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to delete" });
  }
});

// PROJECTS
app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    let query = `SELECT p.*, u.full_name as client_name, u.email as client_email, u.phone as client_phone, u.company FROM projects p JOIN users u ON p.client_id = u.id`;
    const params = [];

    if (req.user.role === "client") {
      query += " WHERE p.client_id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY p.created_at DESC LIMIT 100";
    const [projects] = await pool.query(query, params);
    res.json({ ok: true, projects });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to fetch projects" });
  }
});

app.get("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const [projects] = await pool.query(
      `SELECT p.*, u.full_name as client_name, u.email as client_email, u.phone as client_phone, u.company FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );

    if (!projects.length)
      return res.status(404).json({ ok: false, error: "Not found" });

    const project = projects[0];
    if (req.user.role === "client" && project.client_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Access denied" });
    }

    const [milestones] = await pool.query(
      "SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date",
      [req.params.id]
    );
    const [updates] = await pool.query(
      `SELECT pu.*, u.full_name as updated_by_name FROM project_updates pu JOIN users u ON pu.updated_by = u.id WHERE pu.project_id = ? ORDER BY pu.created_at DESC LIMIT 50`,
      [req.params.id]
    );
    const [payments] = await pool.query(
      "SELECT * FROM payments WHERE project_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );
    const [assignments] = await pool.query(
      `SELECT pa.*, u.full_name as admin_name, u.email as admin_email FROM project_assignments pa JOIN users u ON pa.admin_id = u.id WHERE pa.project_id = ?`,
      [req.params.id]
    );

    res.json({
      ok: true,
      project: { ...project, milestones, updates, payments, assignments },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to fetch project" });
  }
});

// DASHBOARD STATS
app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const [totalProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects"
      );
      const [pendingProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE status = 'pending'"
      );
      const [activeProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE status IN ('approved', 'in_progress')"
      );
      const [totalClients] = await pool.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'client' AND is_active = TRUE"
      );
      const [newLeads] = await pool.query(
        "SELECT COUNT(*) as count FROM leads WHERE status = 'new'"
      );

      res.json({
        ok: true,
        stats: {
          totalProjects: totalProjects[0].count,
          pendingProjects: pendingProjects[0].count,
          activeProjects: activeProjects[0].count,
          totalClients: totalClients[0].count,
          newLeads: newLeads[0].count,
        },
      });
    } else {
      const [myProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE client_id = ?",
        [req.user.id]
      );
      const [activeProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE client_id = ? AND status IN ('approved', 'in_progress')",
        [req.user.id]
      );
      const [completedProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE client_id = ? AND status = 'completed'",
        [req.user.id]
      );

      res.json({
        ok: true,
        stats: {
          myProjects: myProjects[0].count,
          activeProjects: activeProjects[0].count,
          completedProjects: completedProjects[0].count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
});

// NOTIFICATIONS
app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json({ ok: true, notifications });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed" });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
