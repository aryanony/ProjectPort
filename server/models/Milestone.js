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
