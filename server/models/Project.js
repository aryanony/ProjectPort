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
