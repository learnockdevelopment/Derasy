import mongoose from "mongoose";

// Register dependent models (must be imported at least once)
import '@/models/Child';
import '@/models/School';
import '@/models/Application';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["parent", "school_owner", "moderator", "admin"],
      default: "parent"
    },

    avatar: { type: String }, // ✅ New field for ImageKit avatar URL

    wallet: {
      balance: { type: Number, default: 0 },
      currency: { type: String, default: "EGP" },
    },

    emailVerified: { type: Boolean, default: false },

    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Export model or reuse if already compiled
export default mongoose.models.User || mongoose.model("User", userSchema);
