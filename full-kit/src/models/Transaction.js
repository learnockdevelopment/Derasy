import mongoose from "mongoose"

import "@/models/Child" // ✅ register the schema
import "@/models/User" // ✅ if not already registered
import "@/models/School" // ✅ if not already registered
import "@/models/Application" // ✅ must import your main model

const transactionSchema = new mongoose.Schema(
  {
    user: {
      // The owner of the transaction (who sees it in their wallet)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      // Optional: another user (for transfers or destination)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "refund", "hold_income", "hold_expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["wallet", "credit_card", "fawry", "manual"],
      required: true,
    },
    reference: { type: String }, // Could be transactionId, applicationId, etc.
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema)
