// models/Log.js
import mongoose from 'mongoose';
import '@/models/Child'; // ✅ register the schema
import '@/models/User';  // ✅ if not already registered
import '@/models/School'; // ✅ if not already registered
import '@/models/Application'; // ✅ must import your main model


const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info',
    },
    message: String,
    meta: Object,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ip: String,
    endpoint: String,
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model('Log', logSchema);
