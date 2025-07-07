// models/Log.js
import mongoose from 'mongoose';

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
