// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["parent", "school_owner", "moderator", "admin"],
    default: "parent"
  },

  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "EGP" },

  },
  emailVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiresAt: Date
  }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
