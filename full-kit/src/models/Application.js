import mongoose from "mongoose";
import '@/models/Child'; // ✅ register the schema
import '@/models/User';  // ✅ if not already registered
import '@/models/School'; // ✅ if not already registered
import '@/models/Application'; // ✅ must import your main model


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

  // ✅ ولي الأمر يقترح أكثر من موعد للمقابلة
  preferredInterviewSlots: [
    {
      date: Date,
      timeRange: {
        from: String, // e.g. "10:00 AM"
        to: String     // e.g. "12:00 PM"
      }
    }
  ],

  // ✅ المدرسة تحدد الموعد الرسمي للمقابلة
  interview: {
    date: Date,
    time: String,     // e.g. "11:30 AM"
    location: String, // optional: يمكن استخدامه لعرض العنوان
    notes: String     // optional: ملاحظات من المدرسة
  },

  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
