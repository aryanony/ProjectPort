// server/index.js - Complete Backend API
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: CLIENT_ORIGIN }));

// ============= MIDDLEWARE =============
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ ok: false, error: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.query(
      "SELECT id, email, full_name, role FROM users WHERE id = ? AND is_active = TRUE",
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
    return res.status(403).json({ ok: false, error: "Admin access required" });
  }
  next();
};

// ============= AUTH ROUTES =============
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, full_name, phone, company } = req.body;

    if (!email || !password || !full_name) {
      return res
        .status(400)
        .json({ ok: false, error: "Email, password and full name required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password, full_name, phone, company, role) VALUES (?, ?, ?, ?, ?, 'client')",
      [email, hashedPassword, full_name, phone || null, company || null]
    );

    const token = jwt.sign(
      { id: result.insertId, role: "client" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: result.insertId, email, full_name, role: "client" },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ ok: false, error: "Email already registered" });
    }
    res.status(500).json({ ok: false, error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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

// ============= PROJECT ROUTES =============
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const {
      projectName,
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

    if (!projectName) {
      return res
        .status(400)
        .json({ ok: false, error: "Project name required" });
    }

    const estimateFinal = estimate?.final || budget || null;
    const [result] = await pool.query(
      `
      INSERT INTO projects 
      (project_name, client_id, type_key, type_label, tech_stack, description, 
       budget, estimate_final, estimate_json, modules, addons, resources, 
       hosting, cms, estimated_weeks, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
      [
        projectName,
        req.user.id,
        typeKey,
        typeLabel,
        techStack,
        description,
        budget,
        estimateFinal,
        JSON.stringify(estimate || {}),
        JSON.stringify(modules || []),
        JSON.stringify(addons || []),
        JSON.stringify(resources || []),
        hosting,
        cms,
        estimatedTimeWeeks,
      ]
    );

    // Create notification for admins
    const [admins] = await pool.query(
      "SELECT id FROM users WHERE role = 'admin'"
    );
    for (const admin of admins) {
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
        [
          admin.id,
          "New Project Request",
          `${req.user.full_name} submitted "${projectName}"`,
          `/admin/projects/${result.insertId}`,
        ]
      );
    }

    res.json({ ok: true, projectId: result.insertId });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ ok: false, error: "Failed to create project" });
  }
});

// ============= LEADS ROUTES (NO AUTH REQUIRED) =============
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
        .json({
          ok: false,
          error: "Project name, name, email and phone required",
        });
    }

    const [result] = await pool.query(
      `
      INSERT INTO leads 
      (project_name, full_name, email, phone, company, type_key, type_label, 
       tech_stack, description, budget, estimate_json, modules, addons, 
       resources, hosting, cms, estimated_weeks, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `,
      [
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
        JSON.stringify(estimate || {}),
        JSON.stringify(modules || []),
        JSON.stringify(addons || []),
        JSON.stringify(resources || []),
        hosting,
        cms,
        estimatedTimeWeeks,
      ]
    );

    // Notify admins about new lead
    const [admins] = await pool.query(
      "SELECT id FROM users WHERE role = 'admin'"
    );
    for (const admin of admins) {
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
        [
          admin.id,
          "New Lead Inquiry",
          `${name} (${email}) submitted inquiry for "${projectName}"`,
          `/admin/leads/${result.insertId}`,
        ]
      );
    }

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

// Get all leads (Admin only)
app.get("/api/leads", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [leads] = await pool.query(
      "SELECT * FROM leads ORDER BY created_at DESC LIMIT 200"
    );
    res.json({ ok: true, leads });
  } catch (err) {
    console.error("Get leads error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch leads" });
  }
});

// Get single lead (Admin only)
app.get("/api/leads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [leads] = await pool.query("SELECT * FROM leads WHERE id = ?", [
      req.params.id,
    ]);
    if (!leads.length) {
      return res.status(404).json({ ok: false, error: "Lead not found" });
    }
    res.json({ ok: true, lead: leads[0] });
  } catch (err) {
    console.error("Get lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch lead" });
  }
});

// Convert lead to client (Admin only)
app.post(
  "/api/leads/:id/convert",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ ok: false, error: "Password required" });
      }

      // Get lead details
      const [leads] = await pool.query("SELECT * FROM leads WHERE id = ?", [
        req.params.id,
      ]);
      if (!leads.length) {
        return res.status(404).json({ ok: false, error: "Lead not found" });
      }

      const lead = leads[0];

      // Check if user already exists
      const [existingUsers] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [lead.email]
      );
      if (existingUsers.length) {
        return res
          .status(400)
          .json({ ok: false, error: "User with this email already exists" });
      }

      // Create user account
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await pool.query(
        "INSERT INTO users (email, password, full_name, phone, company, role) VALUES (?, ?, ?, ?, ?, 'client')",
        [lead.email, hashedPassword, lead.full_name, lead.phone, lead.company]
      );

      const userId = userResult.insertId;

      // Create project for the new client
      const [projectResult] = await pool.query(
        `
      INSERT INTO projects 
      (project_name, client_id, type_key, type_label, tech_stack, description, 
       budget, estimate_final, estimate_json, modules, addons, resources, 
       hosting, cms, estimated_weeks, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')
    `,
        [
          lead.project_name,
          userId,
          lead.type_key,
          lead.type_label,
          lead.tech_stack,
          lead.description,
          lead.budget,
          lead.budget,
          lead.estimate_json,
          lead.modules,
          lead.addons,
          lead.resources,
          lead.hosting,
          lead.cms,
          lead.estimated_weeks,
        ]
      );

      // Update lead status
      await pool.query(
        "UPDATE leads SET status = 'converted', converted_user_id = ?, converted_at = NOW() WHERE id = ?",
        [userId, req.params.id]
      );

      // Notify new client
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'success', ?)",
        [
          userId,
          "Welcome to ProjectPort!",
          `Your account has been created. Your project "${lead.project_name}" is now approved!`,
          `/client/projects/${projectResult.insertId}`,
        ]
      );

      res.json({
        ok: true,
        message: "Lead converted to client successfully",
        user: { id: userId, email: lead.email, full_name: lead.full_name },
        project: { id: projectResult.insertId, name: lead.project_name },
      });
    } catch (err) {
      console.error("Convert lead error:", err);
      res.status(500).json({ ok: false, error: "Failed to convert lead" });
    }
  }
);

app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    let query = `
      SELECT p.*, u.full_name as client_name, u.email as client_email, u.phone as client_phone
      FROM projects p
      JOIN users u ON p.client_id = u.id
    `;
    const params = [];

    if (req.user.role === "client") {
      query += " WHERE p.client_id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY p.created_at DESC LIMIT 100";

    const [projects] = await pool.query(query, params);

    res.json({ ok: true, projects });
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch projects" });
  }
});

app.get("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const [projects] = await pool.query(
      `
      SELECT p.*, u.full_name as client_name, u.email as client_email, u.phone as client_phone, u.company
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.id = ?
    `,
      [req.params.id]
    );

    if (!projects.length) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    const project = projects[0];

    // Check access
    if (req.user.role === "client" && project.client_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Access denied" });
    }

    // Get milestones
    const [milestones] = await pool.query(
      "SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date",
      [req.params.id]
    );

    // Get updates
    const [updates] = await pool.query(
      `
      SELECT pu.*, u.full_name as updated_by_name
      FROM project_updates pu
      JOIN users u ON pu.updated_by = u.id
      WHERE pu.project_id = ?
      ORDER BY pu.created_at DESC
      LIMIT 20
    `,
      [req.params.id]
    );

    // Get payments
    const [payments] = await pool.query(
      "SELECT * FROM payments WHERE project_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    // Get assignments
    const [assignments] = await pool.query(
      `
      SELECT pa.*, u.full_name as admin_name, u.email as admin_email
      FROM project_assignments pa
      JOIN users u ON pa.admin_id = u.id
      WHERE pa.project_id = ?
    `,
      [req.params.id]
    );

    res.json({
      ok: true,
      project: {
        ...project,
        milestones,
        updates,
        payments,
        assignments,
      },
    });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch project" });
  }
});

app.patch("/api/projects/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, priority, start_date, end_date, estimated_weeks } =
      req.body;
    const updates = [];
    const params = [];

    if (status) {
      updates.push("status = ?");
      params.push(status);
    }
    if (priority) {
      updates.push("priority = ?");
      params.push(priority);
    }
    if (start_date) {
      updates.push("start_date = ?");
      params.push(start_date);
    }
    if (end_date) {
      updates.push("end_date = ?");
      params.push(end_date);
    }
    if (estimated_weeks) {
      updates.push("estimated_weeks = ?");
      params.push(estimated_weeks);
    }

    if (!updates.length) {
      return res.status(400).json({ ok: false, error: "No updates provided" });
    }

    params.push(req.params.id);
    await pool.query(
      `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    // Log update
    if (status) {
      await pool.query(
        "INSERT INTO project_updates (project_id, updated_by, update_type, title, new_status) VALUES (?, ?, 'status', 'Status Updated', ?)",
        [req.params.id, req.user.id, status]
      );

      // Notify client
      const [projects] = await pool.query(
        "SELECT client_id, project_name FROM projects WHERE id = ?",
        [req.params.id]
      );
      if (projects.length) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
          [
            projects[0].client_id,
            "Project Status Updated",
            `Your project "${projects[0].project_name}" status changed to ${status}`,
            `/client/projects/${req.params.id}`,
          ]
        );
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ ok: false, error: "Failed to update project" });
  }
});

// ============= MILESTONE ROUTES =============
app.post(
  "/api/projects/:id/milestones",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { title, description, due_date } = req.body;

      await pool.query(
        "INSERT INTO milestones (project_id, title, description, due_date) VALUES (?, ?, ?, ?)",
        [req.params.id, title, description, due_date]
      );

      res.json({ ok: true });
    } catch (err) {
      console.error("Create milestone error:", err);
      res.status(500).json({ ok: false, error: "Failed to create milestone" });
    }
  }
);

app.patch(
  "/api/milestones/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { status, percentage } = req.body;
      const updates = [];
      const params = [];

      if (status) {
        updates.push("status = ?");
        params.push(status);
        if (status === "completed") {
          updates.push("completed_at = NOW()");
        }
      }
      if (percentage !== undefined) {
        updates.push("percentage = ?");
        params.push(percentage);
      }

      params.push(req.params.id);
      await pool.query(
        `UPDATE milestones SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      res.json({ ok: true });
    } catch (err) {
      console.error("Update milestone error:", err);
      res.status(500).json({ ok: false, error: "Failed to update milestone" });
    }
  }
);

// ============= UPDATE ROUTES =============
app.post(
  "/api/projects/:id/updates",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { title, message, update_type } = req.body;

      await pool.query(
        "INSERT INTO project_updates (project_id, updated_by, update_type, title, message) VALUES (?, ?, ?, ?, ?)",
        [req.params.id, req.user.id, update_type || "note", title, message]
      );

      // Notify client
      const [projects] = await pool.query(
        "SELECT client_id, project_name FROM projects WHERE id = ?",
        [req.params.id]
      );
      if (projects.length) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
          [
            projects[0].client_id,
            `Update on ${projects[0].project_name}`,
            title,
            `/client/projects/${req.params.id}`,
          ]
        );
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("Create update error:", err);
      res.status(500).json({ ok: false, error: "Failed to create update" });
    }
  }
);

// ============= PAYMENT ROUTES =============
app.post(
  "/api/projects/:id/payments",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { amount, payment_type, due_date, notes } = req.body;

      await pool.query(
        "INSERT INTO payments (project_id, amount, payment_type, due_date, notes) VALUES (?, ?, ?, ?, ?)",
        [req.params.id, amount, payment_type, due_date, notes]
      );

      res.json({ ok: true });
    } catch (err) {
      console.error("Create payment error:", err);
      res.status(500).json({ ok: false, error: "Failed to create payment" });
    }
  }
);

// ============= NOTIFICATION ROUTES =============
app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );

    res.json({ ok: true, notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch notifications" });
  }
});

app.patch("/api/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res
      .status(500)
      .json({ ok: false, error: "Failed to mark notification as read" });
  }
});

// ============= DASHBOARD STATS =============
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
        "SELECT COUNT(*) as count FROM projects WHERE status = 'in_progress'"
      );
      const [totalClients] = await pool.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'client'"
      );

      res.json({
        ok: true,
        stats: {
          totalProjects: totalProjects[0].count,
          pendingProjects: pendingProjects[0].count,
          activeProjects: activeProjects[0].count,
          totalClients: totalClients[0].count,
        },
      });
    } else {
      const [myProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE client_id = ?",
        [req.user.id]
      );
      const [activeProjects] = await pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE client_id = ? AND status = 'in_progress'",
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
    console.error("Get stats error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
});

// Health check
app.get("/api/health", (req, res) =>
  res.json({ ok: true, timestamp: Date.now() })
);

app.listen(PORT, () => {
  console.log(`✅ ProjectPort API running on http://localhost:${PORT}`);
});
