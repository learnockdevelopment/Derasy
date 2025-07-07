// models/Parent.js
import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String, // optional if you’ll email them later to set it
  address: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
}, { timestamps: true });

export default mongoose.models.Parent || mongoose.model("Parent", parentSchema);
