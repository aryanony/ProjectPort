// ===== FILE 8: server/models/ProjectUpdate.js =====
const mongoose = require("mongoose");

const projectUpdateSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  update_type: { type: String, default: "note" },
  title: { type: String, required: true },
  message: { type: String, default: null },
  new_status: { type: String, default: null }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectUpdateSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("ProjectUpdate", projectUpdateSchema, "project_updates");
