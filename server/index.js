<<<<<<< HEAD
// ===== FILE 11: server/index.js =====
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const connectDB = require("./db");

const User = require("./models/User");
const Lead = require("./models/Lead");
const Project = require("./models/Project");
const Milestone = require("./models/Milestone");
const Payment = require("./models/Payment");
const ProjectUpdate = require("./models/ProjectUpdate");
const ProjectAssignment = require("./models/ProjectAssignment");
const Notification = require("./models/Notification");

const app = express();
const { PORT, CLIENT_ORIGIN, JWT_SECRET, JWT_EXPIRES_IN } = require("./config/env");
=======
// server/index.js - PERFECT MERGE: All Features + Working Lead Conversion
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// ============= MIDDLEWARE =============
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ok: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
<<<<<<< HEAD
    const user = await User.findOne({ _id: decoded.id, is_active: true }).select('-password');
    
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid token" });
    }

    req.user = user;
=======
    const [users] = await pool.query(
      "SELECT id, email, full_name, role, phone, company FROM users WHERE id = ? AND is_active = TRUE",
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({ ok: false, error: "Invalid token" });
    }

    req.user = users[0];
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
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
<<<<<<< HEAD
      return res.status(400).json({ ok: false, error: "Email, password and full name are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ ok: false, error: "Email already registered" });
    }

    const user = new User({
      email,
      password,
      full_name,
      phone: phone || null,
      company: company || null,
      role: 'client'
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: "client" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
=======
      return res.status(400).json({
        ok: false,
        error: "Email, password and full name are required",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        ok: false,
        error: "Email already registered",
      });
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    );

    res.json({
      ok: true,
      token,
      user: {
<<<<<<< HEAD
        id: user._id,
        email,
        full_name,
        phone: user.phone,
        company: user.company,
=======
        id: result.insertId,
        email,
        full_name,
        phone: phone || null,
        company: company || null,
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
        role: "client",
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ ok: false, error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
<<<<<<< HEAD
      return res.status(400).json({ ok: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email, is_active: true }).select('+password');
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const validPassword = await user.comparePassword(password);
=======
      return res.status(400).json({
        ok: false,
        error: "Email and password are required",
      });
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

>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    if (!validPassword) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

<<<<<<< HEAD
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
=======
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    });

    res.json({
      ok: true,
      token,
      user: {
<<<<<<< HEAD
        id: user._id,
=======
        id: user.id,
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
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
<<<<<<< HEAD
  res.json({ ok: true, user: { id: req.user._id, email: req.user.email, full_name: req.user.full_name, role: req.user.role, phone: req.user.phone, company: req.user.company } });
=======
  res.json({ ok: true, user: req.user });
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
});

// ============= LEADS ROUTES =============
app.post("/api/leads", async (req, res) => {
  try {
    const {
<<<<<<< HEAD
      projectName, name, email, phone, company, typeKey, typeLabel,
      techStack, description, budget, estimate, modules, addons,
      resources, hosting, cms, estimatedTimeWeeks,
    } = req.body;

    if (!projectName || !name || !email || !phone) {
      return res.status(400).json({ ok: false, error: "Project name, name, email and phone are required" });
    }

    const lead = new Lead({
      project_name: projectName,
      full_name: name,
      email,
      phone,
      company: company || null,
      type_key: typeKey,
      type_label: typeLabel,
      tech_stack: techStack || null,
      description: description || null,
      budget: budget || 0,
      estimate_json: estimate || {},
      modules: modules || [],
      addons: addons || [],
      resources: resources || [],
      hosting: hosting || null,
      cms: cms || null,
      estimated_weeks: estimatedTimeWeeks || 4,
      status: 'new'
    });
    
    await lead.save();

    const admins = await User.find({ role: 'admin', is_active: true });
    
    const notifs = admins.map(admin => ({
      user_id: admin._id,
      title: "New Lead Inquiry",
      message: `${name} submitted inquiry for "${projectName}"`,
      type: 'info',
      link: `/admin/leads`
    }));
    
    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
=======
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
      return res.status(400).json({
        ok: false,
        error: "Project name, name, email and phone are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO leads 
      (project_name, full_name, email, phone, company, type_key, type_label, 
       tech_stack, description, budget, estimate_json, modules, addons, 
       resources, hosting, cms, estimated_weeks, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
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

    const [admins] = await pool.query(
      "SELECT id FROM users WHERE role = 'admin' AND is_active = TRUE"
    );

    for (const admin of admins) {
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
        [
          admin.id,
          "New Lead Inquiry",
          `${name} submitted inquiry for "${projectName}"`,
          `/admin/leads`,
        ]
      );
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    }

    res.json({
      ok: true,
<<<<<<< HEAD
      leadId: lead._id,
=======
      leadId: result.insertId,
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
      message: "Thank you! We'll contact you within 24 hours.",
    });
  } catch (err) {
    console.error("Create lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to submit inquiry" });
  }
});

app.get("/api/leads", authMiddleware, adminOnly, async (req, res) => {
  try {
<<<<<<< HEAD
    const leads = await Lead.find().sort({ created_at: -1 }).limit(200).lean();
    res.json({ ok: true, leads: leads.map(l => {
      const obj = { ...l };
      obj.id = obj._id;
      return obj;
    })});
=======
    const [leads] = await pool.query(
      "SELECT * FROM leads ORDER BY created_at DESC LIMIT 200"
    );
    res.json({ ok: true, leads });
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Get leads error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch leads" });
  }
});

app.get("/api/leads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
<<<<<<< HEAD
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) {
      return res.status(404).json({ ok: false, error: "Lead not found" });
    }
    lead.id = lead._id;
    res.json({ ok: true, lead });
=======
    const [leads] = await pool.query("SELECT * FROM leads WHERE id = ?", [
      req.params.id,
    ]);
    if (!leads.length) {
      return res.status(404).json({ ok: false, error: "Lead not found" });
    }
    res.json({ ok: true, lead: leads[0] });
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Get lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch lead" });
  }
});

<<<<<<< HEAD
// Convert Lead
app.post("/api/leads/:id/convert", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ ok: false, error: "Password must be at least 6 characters" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ ok: false, error: "Lead not found" });
    }

    if (lead.status === "converted") {
      return res.status(400).json({ ok: false, error: "Lead already converted" });
    }

    const existingUser = await User.findOne({ email: lead.email });
    if (existingUser) {
      return res.status(400).json({ ok: false, error: `User with email ${lead.email} already exists` });
    }

    const user = new User({
      email: lead.email,
      password,
      full_name: lead.full_name,
      phone: lead.phone || null,
      company: lead.company || null,
      role: 'client',
      is_active: true
    });
    await user.save();

    let estimateFinal = lead.budget || 0;
    try {
      if (lead.estimate_json) {
        estimateFinal = lead.estimate_json.final || lead.budget || 0;
      }
    } catch (e) {
      console.log("Parse estimate error:", e);
    }

    const project = new Project({
      project_name: lead.project_name || "Untitled Project",
      client_id: user._id,
      type_key: lead.type_key || null,
      type_label: lead.type_label || null,
      tech_stack: lead.tech_stack || null,
      description: lead.description || null,
      budget: lead.budget || 0,
      estimate_final: estimateFinal,
      estimate_json: lead.estimate_json,
      modules: lead.modules,
      addons: lead.addons,
      resources: lead.resources,
      hosting: lead.hosting || null,
      cms: lead.cms || null,
      estimated_weeks: lead.estimated_weeks || 4,
      status: "approved",
      priority: "medium"
    });
    await project.save();

    lead.status = "converted";
    lead.converted_user_id = user._id;
    lead.converted_at = new Date();
    await lead.save();

    await Notification.create([
      {
        user_id: user._id,
        title: "Welcome to ProjectPort!",
        message: `Your account has been created! Your project "${lead.project_name}" is now approved. Login with email: ${lead.email}`,
        type: 'success',
        link: `/client/projects/${project._id}`
      },
      {
        user_id: req.user._id,
        title: "Lead Converted Successfully",
        message: `${lead.full_name} is now a client! Project "${lead.project_name}" created successfully.`,
        type: 'success',
        link: `/admin/projects/${project._id}`
      }
    ]);

    res.json({
      ok: true,
      message: "Lead successfully converted to client!",
      user: { id: user._id, email: lead.email, full_name: lead.full_name },
      project: { id: project._id, name: lead.project_name },
    });
  } catch (err) {
    console.error("Convert lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to convert lead: " + err.message });
  }
});

app.post("/api/leads/:id/reject", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ ok: true, message: "Lead rejected" });
  } catch (err) {
    console.error("Reject lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to reject lead" });
  }
});

app.delete("/api/leads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
=======
// ============= CONVERT LEAD TO CLIENT - WORKING VERSION FROM INDEX2 =============
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
        return res.status(400).json({
          ok: false,
          error: "Password must be at least 6 characters",
        });
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
        return res.status(400).json({
          ok: false,
          error: "Lead already converted",
        });
      }

      // Check if user exists
      const [existingUsers] = await connection.query(
        "SELECT id, email, full_name, role FROM users WHERE email = ?",
        [lead.email]
      );

      if (existingUsers.length > 0) {
        await connection.rollback();
        return res.status(400).json({
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

      // Create project - WORKING VERSION with proper value handling
      const projectValues = [
        lead.project_name || "Untitled Project",
        userId,
        lead.type_key || null,
        lead.type_label || null,
        lead.tech_stack || null,
        lead.description || null,
        lead.budget || 0,
        estimateFinal,
        lead.estimate_json ? JSON.stringify(lead.estimate_json) : null,
        lead.modules ? JSON.stringify(lead.modules) : null,
        lead.addons ? JSON.stringify(lead.addons) : null,
        lead.resources ? JSON.stringify(lead.resources) : null,
        lead.hosting || null,
        lead.cms || null,
        lead.estimated_weeks || 4,
        "approved",
        "medium",
      ];

      const [projectResult] = await connection.query(
        `INSERT INTO projects 
      (project_name, client_id, type_key, type_label, tech_stack, description, 
       budget, estimate_final, estimate_json, modules, addons, resources, 
       hosting, cms, estimated_weeks, status, priority) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        projectValues
      );

      const projectId = projectResult.insertId;

      // Update lead
      await connection.query(
        "UPDATE leads SET status = 'converted', converted_user_id = ?, converted_at = NOW() WHERE id = ?",
        [userId, req.params.id]
      );

      // Create notifications
      await connection.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'success', ?)",
        [
          userId,
          "Welcome to ProjectPort!",
          `Your account has been created! Your project "${lead.project_name}" is now approved. Login with email: ${lead.email}`,
          `/client/projects/${projectId}`,
        ]
      );

      await connection.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'success', ?)",
        [
          req.user.id,
          "Lead Converted Successfully",
          `${lead.full_name} is now a client! Project "${lead.project_name}" created successfully.`,
          `/admin/projects/${projectId}`,
        ]
      );

      await connection.commit();

      res.json({
        ok: true,
        message: "Lead successfully converted to client!",
        user: {
          id: userId,
          email: lead.email,
          full_name: lead.full_name,
          password: password,
        },
        project: {
          id: projectId,
          name: lead.project_name,
        },
      });
    } catch (err) {
      await connection.rollback();
      console.error("Convert lead error:", err);
      console.error("Error message:", err.message);
      console.error("SQL:", err.sql);
      res.status(500).json({
        ok: false,
        error: "Failed to convert lead: " + err.message,
      });
    } finally {
      connection.release();
    }
  }
);

// Reject lead
app.post(
  "/api/leads/:id/reject",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      await pool.query("UPDATE leads SET status = 'rejected' WHERE id = ?", [
        req.params.id,
      ]);
      res.json({ ok: true, message: "Lead rejected" });
    } catch (err) {
      console.error("Reject lead error:", err);
      res.status(500).json({ ok: false, error: "Failed to reject lead" });
    }
  }
);

// Delete lead
app.delete("/api/leads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query("DELETE FROM leads WHERE id = ?", [req.params.id]);
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    res.json({ ok: true, message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Delete lead error:", err);
    res.status(500).json({ ok: false, error: "Failed to delete lead" });
  }
});

// ============= PROJECT ROUTES =============
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const {
<<<<<<< HEAD
      projectName, typeKey, typeLabel, techStack, description,
      budget, estimate, modules, addons, resources, hosting, cms, estimatedTimeWeeks,
    } = req.body;

    if (!projectName) {
      return res.status(400).json({ ok: false, error: "Project name required" });
=======
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    }

    const estimateFinal = estimate?.final || budget || 0;

<<<<<<< HEAD
    const project = new Project({
      project_name: projectName,
      client_id: req.user._id,
      type_key: typeKey || null,
      type_label: typeLabel || null,
      tech_stack: techStack || null,
      description: description || null,
      budget: budget || 0,
      estimate_final: estimateFinal,
      estimate_json: estimate || {},
      modules: modules || [],
      addons: addons || [],
      resources: resources || [],
      hosting: hosting || null,
      cms: cms || null,
      estimated_weeks: estimatedTimeWeeks || 4,
      status: "pending",
      priority: "medium"
    });
    
    await project.save();

    const admins = await User.find({ role: 'admin', is_active: true });
    const notifs = admins.map(admin => ({
      user_id: admin._id,
      title: "New Project Submitted",
      message: `${req.user.full_name} submitted "${projectName}"`,
      type: 'info',
      link: `/admin/projects/${project._id}`
    }));
    
    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }

    res.json({ ok: true, projectId: project._id });
=======
    const [result] = await pool.query(
      `INSERT INTO projects 
      (project_name, client_id, type_key, type_label, tech_stack, description, 
       budget, estimate_final, estimate_json, modules, addons, resources, 
       hosting, cms, estimated_weeks, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectName,
        req.user.id,
        typeKey || null,
        typeLabel || null,
        techStack || null,
        description || null,
        budget || 0,
        estimateFinal,
        JSON.stringify(estimate || {}),
        JSON.stringify(modules || []),
        JSON.stringify(addons || []),
        JSON.stringify(resources || []),
        hosting || null,
        cms || null,
        estimatedTimeWeeks || 4,
        "pending",
        "medium",
      ]
    );

    const [admins] = await pool.query(
      "SELECT id FROM users WHERE role = 'admin' AND is_active = TRUE"
    );

    for (const admin of admins) {
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
        [
          admin.id,
          "New Project Submitted",
          `${req.user.full_name} submitted "${projectName}"`,
          `/admin/projects/${result.insertId}`,
        ]
      );
    }

    res.json({ ok: true, projectId: result.insertId });
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ ok: false, error: "Failed to create project" });
  }
});

app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    const filter = {};
    if (req.user.role === "client") {
      filter.client_id = req.user._id;
    }

    const projects = await Project.find(filter)
      .populate('client_id', 'full_name email phone company')
      .sort({ created_at: -1 })
      .limit(100)
      .lean();

    const formattedProjects = projects.map(p => {
      p.id = p._id;
      if (p.client_id && typeof p.client_id === 'object') {
        p.client_name = p.client_id.full_name;
        p.client_email = p.client_id.email;
        p.client_phone = p.client_id.phone;
        p.company = p.client_id.company;
        p.client_id = p.client_id._id;
      }
      return p;
    });

    res.json({ ok: true, projects: formattedProjects });
=======
    let query = `
      SELECT p.*, u.full_name as client_name, u.email as client_email, 
             u.phone as client_phone, u.company
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch projects" });
  }
});

app.get("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    const project = await Project.findById(req.params.id)
      .populate('client_id', 'full_name email phone company');
      
    if (!project) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    if (req.user.role === "client" && project.client_id._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, error: "Access denied" });
    }

    const [milestones, updates, payments, assignments] = await Promise.all([
      Milestone.find({ project_id: req.params.id }).sort({ due_date: 1 }).lean(),
      ProjectUpdate.find({ project_id: req.params.id })
        .populate('updated_by', 'full_name')
        .sort({ created_at: -1 }).limit(50).lean(),
      Payment.find({ project_id: req.params.id }).sort({ created_at: -1 }).lean(),
      ProjectAssignment.find({ project_id: req.params.id })
        .populate('admin_id', 'full_name email').lean()
    ]);

    const obj = project.toObject();
    obj.id = obj._id;
    if (obj.client_id && typeof obj.client_id === 'object') {
      obj.client_name = obj.client_id.full_name;
      obj.client_email = obj.client_id.email;
      obj.client_phone = obj.client_id.phone;
      obj.company = obj.client_id.company;
      obj.client_id = obj.client_id._id;
    }
    
    obj.milestones = milestones.map(m => ({...m, id: m._id}));
    obj.updates = updates.map(u => ({...u, id: u._id, updated_by_name: u.updated_by?.full_name}));
    obj.payments = payments.map(p => ({...p, id: p._id}));
    obj.assignments = assignments.map(a => ({...a, id: a._id, admin_name: a.admin_id?.full_name, admin_email: a.admin_id?.email}));

    res.json({ ok: true, project: obj });
=======
    const [projects] = await pool.query(
      `SELECT p.*, u.full_name as client_name, u.email as client_email, 
              u.phone as client_phone, u.company
       FROM projects p
       JOIN users u ON p.client_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!projects.length) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    const project = projects[0];

    if (req.user.role === "client" && project.client_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Access denied" });
    }

    const [milestones] = await pool.query(
      "SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date",
      [req.params.id]
    );

    const [updates] = await pool.query(
      `SELECT pu.*, u.full_name as updated_by_name
       FROM project_updates pu
       JOIN users u ON pu.updated_by = u.id
       WHERE pu.project_id = ?
       ORDER BY pu.created_at DESC LIMIT 50`,
      [req.params.id]
    );

    const [payments] = await pool.query(
      "SELECT * FROM payments WHERE project_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    const [assignments] = await pool.query(
      `SELECT pa.*, u.full_name as admin_name, u.email as admin_email
       FROM project_assignments pa
       JOIN users u ON pa.admin_id = u.id
       WHERE pa.project_id = ?`,
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch project" });
  }
});

app.patch("/api/projects/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
<<<<<<< HEAD
    const { status, priority, start_date, end_date, estimated_weeks } = req.body;
    const updates = {};

    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (start_date !== undefined) updates.start_date = start_date || null;
    if (end_date !== undefined) updates.end_date = end_date || null;
    if (estimated_weeks) updates.estimated_weeks = estimated_weeks;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ ok: false, error: "No updates provided" });
    }
    
    updates.updated_at = new Date();

    await Project.findByIdAndUpdate(req.params.id, updates);

    if (status) {
      await ProjectUpdate.create({
        project_id: req.params.id,
        updated_by: req.user._id,
        update_type: 'status',
        title: 'Status Updated',
        new_status: status
      });

      const project = await Project.findById(req.params.id);
      if (project) {
        await Notification.create({
          user_id: project.client_id,
          title: "Project Status Updated",
          message: `Your project "${project.project_name}" status changed to ${status}`,
          type: 'info',
          link: `/client/projects/${req.params.id}`
        });
=======
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
    if (start_date !== undefined) {
      updates.push("start_date = ?");
      params.push(start_date || null);
    }
    if (end_date !== undefined) {
      updates.push("end_date = ?");
      params.push(end_date || null);
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
      `UPDATE projects SET ${updates.join(
        ", "
      )}, updated_at = NOW() WHERE id = ?`,
      params
    );

    if (status) {
      await pool.query(
        "INSERT INTO project_updates (project_id, updated_by, update_type, title, new_status) VALUES (?, ?, 'status', 'Status Updated', ?)",
        [req.params.id, req.user.id, status]
      );

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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
      }
    }

    res.json({ ok: true, message: "Project updated successfully" });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ ok: false, error: "Failed to update project" });
  }
});

app.delete("/api/projects/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
<<<<<<< HEAD
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    await Notification.create({
      user_id: project.client_id,
      title: "Project Cancelled",
      message: `Your project "${project.project_name}" has been cancelled`,
      type: 'warning'
    });

    // Delete related entities as well (simulating cascading deletes)
    await Milestone.deleteMany({ project_id: req.params.id });
    await Payment.deleteMany({ project_id: req.params.id });
    await ProjectUpdate.deleteMany({ project_id: req.params.id });
    await ProjectAssignment.deleteMany({ project_id: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
=======
    const [projects] = await pool.query(
      "SELECT client_id, project_name FROM projects WHERE id = ?",
      [req.params.id]
    );

    if (!projects.length) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    await pool.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'warning')",
      [
        projects[0].client_id,
        "Project Cancelled",
        `Your project "${projects[0].project_name}" has been cancelled`,
      ]
    );

    await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7

    res.json({ ok: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ ok: false, error: "Failed to delete project" });
  }
});

// ============= MILESTONE ROUTES =============
<<<<<<< HEAD
app.post("/api/projects/:id/milestones", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    if (!title || !due_date) {
      return res.status(400).json({ ok: false, error: "Title and due date are required" });
    }

    await Milestone.create({
      project_id: req.params.id,
      title,
      description: description || null,
      due_date,
      status: 'pending'
    });

    res.json({ ok: true, message: "Milestone created successfully" });
  } catch (err) {
    console.error("Create milestone error:", err);
    res.status(500).json({ ok: false, error: "Failed to create milestone" });
  }
});

app.patch("/api/milestones/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, percentage } = req.body;
    const updates = {};

    if (status) {
      updates.status = status;
      if (status === "completed") {
        updates.completed_at = new Date();
        updates.percentage = 100;
      }
    }
    if (percentage !== undefined && status !== "completed") {
      updates.percentage = Math.min(100, Math.max(0, percentage));
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ ok: false, error: "No updates provided" });
    }

    await Milestone.findByIdAndUpdate(req.params.id, updates);
    res.json({ ok: true, message: "Milestone updated successfully" });
  } catch (err) {
    console.error("Update milestone error:", err);
    res.status(500).json({ ok: false, error: "Failed to update milestone" });
  }
});

// ============= UPDATE ROUTES =============
app.post("/api/projects/:id/updates", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, message, update_type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ ok: false, error: "Title and message are required" });
    }

    await ProjectUpdate.create({
      project_id: req.params.id,
      updated_by: req.user._id,
      update_type: update_type || 'note',
      title,
      message
    });

    const project = await Project.findById(req.params.id);
    if (project) {
      await Notification.create({
        user_id: project.client_id,
        title: `Update: ${project.project_name}`,
        message: title,
        type: 'info',
        link: `/client/projects/${req.params.id}`
      });
    }

    res.json({ ok: true, message: "Update posted successfully" });
  } catch (err) {
    console.error("Create update error:", err);
    res.status(500).json({ ok: false, error: "Failed to create update" });
  }
});

// ============= PAYMENT ROUTES =============
app.post("/api/projects/:id/payments", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { amount, payment_type, due_date, status, notes } = req.body;

    if (!amount || !payment_type) {
      return res.status(400).json({ ok: false, error: "Amount and payment type are required" });
    }

    await Payment.create({
      project_id: req.params.id,
      amount,
      payment_type,
      due_date: due_date || null,
      status: status || 'pending',
      notes: notes || null
    });

    const project = await Project.findById(req.params.id);
    if (project) {
      await Notification.create({
        user_id: project.client_id,
        title: "New Payment Added",
        message: `A ${payment_type} payment of ₹${amount.toLocaleString()} has been added to "${project.project_name}"`,
        type: 'info',
        link: `/client/projects/${req.params.id}`
      });
    }

    res.json({ ok: true, message: "Payment added successfully" });
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(500).json({ ok: false, error: "Failed to create payment" });
  }
});
=======
app.post(
  "/api/projects/:id/milestones",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { title, description, due_date } = req.body;

      if (!title || !due_date) {
        return res.status(400).json({
          ok: false,
          error: "Title and due date are required",
        });
      }

      await pool.query(
        "INSERT INTO milestones (project_id, title, description, due_date, status) VALUES (?, ?, ?, ?, 'pending')",
        [req.params.id, title, description || null, due_date]
      );

      res.json({ ok: true, message: "Milestone created successfully" });
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
          updates.push("completed_at = NOW(), percentage = 100");
        }
      }
      if (percentage !== undefined && status !== "completed") {
        updates.push("percentage = ?");
        params.push(Math.min(100, Math.max(0, percentage)));
      }

      if (!updates.length) {
        return res
          .status(400)
          .json({ ok: false, error: "No updates provided" });
      }

      params.push(req.params.id);
      await pool.query(
        `UPDATE milestones SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      res.json({ ok: true, message: "Milestone updated successfully" });
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

      if (!title || !message) {
        return res.status(400).json({
          ok: false,
          error: "Title and message are required",
        });
      }

      await pool.query(
        "INSERT INTO project_updates (project_id, updated_by, update_type, title, message) VALUES (?, ?, ?, ?, ?)",
        [req.params.id, req.user.id, update_type || "note", title, message]
      );

      const [projects] = await pool.query(
        "SELECT client_id, project_name FROM projects WHERE id = ?",
        [req.params.id]
      );
      if (projects.length) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
          [
            projects[0].client_id,
            `Update: ${projects[0].project_name}`,
            title,
            `/client/projects/${req.params.id}`,
          ]
        );
      }

      res.json({ ok: true, message: "Update posted successfully" });
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
      const { amount, payment_type, due_date, status, notes } = req.body;

      if (!amount || !payment_type) {
        return res.status(400).json({
          ok: false,
          error: "Amount and payment type are required",
        });
      }

      await pool.query(
        "INSERT INTO payments (project_id, amount, payment_type, due_date, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [
          req.params.id,
          amount,
          payment_type,
          due_date || null,
          status || "pending",
          notes || null,
        ]
      );

      const [projects] = await pool.query(
        "SELECT client_id, project_name FROM projects WHERE id = ?",
        [req.params.id]
      );
      if (projects.length) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)",
          [
            projects[0].client_id,
            "New Payment Added",
            `A ${payment_type} payment of ₹${amount.toLocaleString()} has been added to "${
              projects[0].project_name
            }"`,
            `/client/projects/${req.params.id}`,
          ]
        );
      }

      res.json({ ok: true, message: "Payment added successfully" });
    } catch (err) {
      console.error("Create payment error:", err);
      res.status(500).json({ ok: false, error: "Failed to create payment" });
    }
  }
);
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7

app.patch("/api/payments/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, paid_at } = req.body;

    if (!status) {
      return res.status(400).json({ ok: false, error: "Status required" });
    }

<<<<<<< HEAD
    const updates = { status };
    if (status === "paid") {
      updates.paid_at = new Date();
    }

    await Payment.findByIdAndUpdate(req.params.id, updates);
=======
    const updates = ["status = ?"];
    const params = [status];

    if (status === "paid") {
      updates.push("paid_at = NOW()");
    }

    params.push(req.params.id);
    await pool.query(
      `UPDATE payments SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
    res.json({ ok: true, message: "Payment updated successfully" });
  } catch (err) {
    console.error("Update payment error:", err);
    res.status(500).json({ ok: false, error: "Failed to update payment" });
  }
});

// ============= NOTIFICATION ROUTES =============
app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    res.json({ ok: true, notifications: notifications.map(n => ({...n, id: n._id})) });
=======
    const [notifications] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );

    res.json({ ok: true, notifications });
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch notifications" });
  }
});

app.patch("/api/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { is_read: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ ok: false, error: "Failed to mark notification as read" });
=======
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  }
});

// ============= DASHBOARD STATS =============
app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
<<<<<<< HEAD
      const [totalProjects, pendingProjects, activeProjects, totalClients, newLeads] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: 'pending' }),
        Project.countDocuments({ status: { $in: ['approved', 'in_progress'] } }),
        User.countDocuments({ role: 'client', is_active: true }),
        Lead.countDocuments({ status: 'new' })
      ]);

      res.json({
        ok: true,
        stats: { totalProjects, pendingProjects, activeProjects, totalClients, newLeads }
      });
    } else {
      const [myProjects, activeProjects, completedProjects] = await Promise.all([
        Project.countDocuments({ client_id: req.user._id }),
        Project.countDocuments({ client_id: req.user._id, status: { $in: ['approved', 'in_progress'] } }),
        Project.countDocuments({ client_id: req.user._id, status: 'completed' })
      ]);

      res.json({
        ok: true,
        stats: { myProjects, activeProjects, completedProjects }
=======
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
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
      });
    }
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

<<<<<<< HEAD
// DB health check
app.get("/api/health/db", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ ok: state === 1, dbState: states[state] || "unknown", timestamp: new Date().toISOString() });
});

=======
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`✅ ProjectPort API running on port ${PORT}`);
=======
  console.log(`✅ ProjectPort API running on https://projectsport.vercel.app:${PORT}`);
>>>>>>> eda06ec735637dfc147bcd48b585479b88ad17a7
  console.log(`📡 CORS enabled for: ${CLIENT_ORIGIN}`);
});
