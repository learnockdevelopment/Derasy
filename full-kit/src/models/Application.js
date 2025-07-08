// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },

  status: {
    type: String,
    enum: ["pending", "under_review", "recommended", "accepted", "rejected", "draft"],
    default: "pending"
  },

  payment: {
    isPaid: { type: Boolean, default: false },
    amount: Number,
    paidAt: Date,
    method: { type: String, enum: ["wallet", "credit_card", "fawry", "other"] },
    transactionId: String
  },

  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
