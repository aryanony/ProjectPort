import os

base_dir = "server"
models_dir = os.path.join(base_dir, "models")
os.makedirs(models_dir, exist_ok=True)

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# User.js
user_js = """
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  phone: { type: String, default: null },
  company: { type: String, default: null },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  is_active: { type: Boolean, default: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("User", userSchema, "users");
"""
write_file(os.path.join(models_dir, "User.js"), user_js)

# Lead.js
lead_js = """
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, default: null },
  type_key: { type: String, default: null },
  type_label: { type: String, default: null },
  tech_stack: { type: String, default: null },
  description: { type: String, default: null },
  budget: { type: Number, default: 0 },
  estimate_json: { type: mongoose.Schema.Types.Mixed, default: {} },
  modules: { type: mongoose.Schema.Types.Mixed, default: [] },
  addons: { type: mongoose.Schema.Types.Mixed, default: [] },
  resources: { type: mongoose.Schema.Types.Mixed, default: [] },
  hosting: { type: String, default: null },
  cms: { type: String, default: null },
  estimated_weeks: { type: Number, default: 4 },
  status: { type: String, default: 'new' },
  converted_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  converted_at: { type: Date, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

leadSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Lead", leadSchema, "leads");
"""
write_file(os.path.join(models_dir, "Lead.js"), lead_js)

# Project.js
project_js = """
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type_key: { type: String, default: null },
  type_label: { type: String, default: null },
  tech_stack: { type: String, default: null },
  description: { type: String, default: null },
  budget: { type: Number, default: 0 },
  estimate_final: { type: Number, default: 0 },
  estimate_json: { type: mongoose.Schema.Types.Mixed, default: {} },
  modules: { type: mongoose.Schema.Types.Mixed, default: [] },
  addons: { type: mongoose.Schema.Types.Mixed, default: [] },
  resources: { type: mongoose.Schema.Types.Mixed, default: [] },
  hosting: { type: String, default: null },
  cms: { type: String, default: null },
  estimated_weeks: { type: Number, default: 4 },
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Project", projectSchema, "projects");
"""
write_file(os.path.join(models_dir, "Project.js"), project_js)

# Milestone.js
milestone_js = """
const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  due_date: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  percentage: { type: Number, default: 0 },
  completed_at: { type: Date, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

milestoneSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Milestone", milestoneSchema, "milestones");
"""
write_file(os.path.join(models_dir, "Milestone.js"), milestone_js)

# Payment.js
payment_js = """
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, default: 'pending' },
  description: { type: String, default: null },
  due_date: { type: Date, required: true },
  paid_at: { type: Date, default: null },
  invoice_url: { type: String, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

paymentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Payment", paymentSchema, "payments");
"""
write_file(os.path.join(models_dir, "Payment.js"), payment_js)

# ProjectUpdate.js
project_update_js = """
const mongoose = require("mongoose");

const projectUpdateSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  update_type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  new_status: { type: String, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectUpdateSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("ProjectUpdate", projectUpdateSchema, "project_updates");
"""
write_file(os.path.join(models_dir, "ProjectUpdate.js"), project_update_js)

# ProjectAssignment.js
project_assignment_js = """
const mongoose = require("mongoose");

const projectAssignmentSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role_in_project: { type: String, default: 'manager' }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectAssignmentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("ProjectAssignment", projectAssignmentSchema, "project_assignments");
"""
write_file(os.path.join(models_dir, "ProjectAssignment.js"), project_assignment_js)

# Notification.js
notification_js = """
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  link: { type: String, default: null },
  is_read: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

notificationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Notification", notificationSchema, "notifications");
"""
write_file(os.path.join(models_dir, "Notification.js"), notification_js)

print("Models created.")
