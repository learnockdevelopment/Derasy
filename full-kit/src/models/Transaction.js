import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'refund'],
    required: true,
  },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['wallet', 'credit_card', 'fawry', 'manual'],
    required: true,
  },
  reference: { type: String }, // transactionId أو applicationId
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
