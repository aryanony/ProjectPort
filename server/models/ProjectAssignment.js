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
