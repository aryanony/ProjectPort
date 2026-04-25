const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  payment_type: { type: String, required: true },
  status: { type: String, default: 'pending' },
  notes: { type: String, default: null },
  due_date: { type: Date, default: null },
  paid_at: { type: Date, default: null }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

paymentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model("Payment", paymentSchema, "payments");
