import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  fullName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  birthDate: { type: Date, required: true },
  nationalId: { type: String },

  currentSchool: { type: String },
  currentGrade: { type: String },
  desiredGrade: { type: String, required: true },

  religion: { type: String, enum: ["Muslim", "Christian", "Other"] },
  specialNeeds: {
    hasNeeds: { type: Boolean, default: false },
    description: { type: String }
  },

  languagePreference: {
    primaryLanguage: { type: String, enum: ["Arabic", "English", "French", "German", "Other"] },
    secondaryLanguage: String
  },

  healthStatus: {
    vaccinated: { type: Boolean },
    notes: String
  },

  zone: { type: String }, // e.g. "Nasr City", "6 October"

  // ✅ New field: Profile image
  profileImage: {
    url: { type: String },
    publicId: { type: String }, // useful if using Cloudinary to delete/update
  },

  // ✅ Optional: Additional documents (array of images)
  documents: [
    {
      url: { type: String },
      publicId: { type: String },
      label: { type: String } // e.g., "Vaccination Card", "Birth Certificate"
    }
  ],

}, { timestamps: true });

export default mongoose.models.Child || mongoose.model("Child", childSchema);
