// ===== FILE 3: server/models/User.js =====
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  full_name: { type: String, required: true, trim: true },
  phone: { type: String, default: null },
  company: { type: String, default: null },
  role: { type: String, enum: ["client", "admin"], default: "client" },
  is_active: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "users");
