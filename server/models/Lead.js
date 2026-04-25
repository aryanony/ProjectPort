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
