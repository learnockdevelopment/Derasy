import mongoose from 'mongoose';

const cardFieldValueSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. "Student Name"
  value: mongoose.Schema.Types.Mixed,    // string, number, date, etc.
}, { _id: false });

const studentIdCardRequestSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Child' if students are children under parents
    required: true,
  },
  fields: [cardFieldValueSchema], // dynamic fields based on school.studentIdCardFields

  photoUrl: String,        // Optional: extracted if "photo" type is uploaded
  cardPreviewUrl: String,  // Optional: image preview URL after rendering
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reason: String, // reason for rejection (if any)
}, { timestamps: true });

export default mongoose.models.StudentIdCardRequest || mongoose.model('StudentIdCardRequest', studentIdCardRequestSchema);
