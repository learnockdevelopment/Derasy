import mongoose from "mongoose"

import "@/models/Child"
import "@/models/User"
import "@/models/School"
import "@/models/Application"

const childSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ageInOctober: { type: Number }, // ✅ Virtual field for age in coming October
    fullName: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    birthDate: { type: Date, required: true },
    nationalId: { type: String },

    currentSchool: { type: String },
    currentGrade: { type: String },
    desiredGrade: { type: String, required: true },

    religion: { type: String, enum: ["Muslim", "Christian", "Other"] },
    specialNeeds: {
      hasNeeds: { type: Boolean, default: false },
      description: { type: String },
    },

    languagePreference: {
      primaryLanguage: {
        type: String,
        enum: ["Arabic", "English", "French", "German", "Other"],
      },
      secondaryLanguage: String,
    },

    healthStatus: {
      vaccinated: { type: Boolean },
      notes: String,
    },

    zone: { type: String }, // e.g. "Nasr City", "6 October"

    birthPlace: { type: String }, // ✅ New field: place of birth

    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },

    documents: [
      {
        url: { type: String },
        publicId: { type: String },
        label: { type: String },
      },
    ],
  },
  { timestamps: true }
)


export default mongoose.models.Child || mongoose.model("Child", childSchema)
