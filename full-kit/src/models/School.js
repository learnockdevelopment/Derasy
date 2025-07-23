// models/School.js
import mongoose from "mongoose";
import '@/models/Child'; // ✅ register the schema
import '@/models/User';  // ✅ if not already registered
import '@/models/School'; // ✅ if not already registered
import '@/models/Application'; // ✅ must import your main model
import { max } from "date-fns";


const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // e.g. for URL: /schools/al-noor-international

  type: {
    type: String,
    enum: ["Public", "Private", "International", "National", "Experimental", "Language"],
    required: true
  },
  idCard: {
    url: { type: String },
    publicId: { type: String },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 400 },
    aspectRatio: { type: String, default: "3:2" }, // e.g. "3:2", "16:9"
  },
  ownership: {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },

  branches: [{
    name: String,
    governorate: String,
    zone: String,
    address: String,
    contactEmail: String,
    contactPhone: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    facilities: [String], // e.g. ["Sports Hall", "Library", "Bus Service"]
  }],
  studentIdCardFields: [
    {
      key: { type: String, required: true },
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'photo', 'select'],
        default: 'text'
      },
      options: [String], // used if type is "select"
      style: {
        x: { type: Number, default: 0 },
        xPercentage: { type: Number, default: 0, max: 100 },
        y: { type: Number, default: 0 },
        yPercentage: { type: Number, default: 0, max: 100 },
        fontSize: { type: Number, default: 14 },
        fontWeight: { type: String, enum: ['normal', 'bold'], default: 'normal' },
        color: { type: String, default: '#000000' },
        width: { type: Number },   // for image/photo types
        height: { type: Number }   // for image/photo types
      }
    }
  ],

  gradesOffered: [String], // e.g. ["KG1", "KG2", "Primary 1", ...]
  ageRequirement: {
    KG1: Number,
    KG2: Number,
    Primary1: Number
  },

  languages: [String], // e.g. ["Arabic", "English", "French"]
  isReligious: Boolean,
  religionType: { type: String, enum: ["Muslim", "Christian", "Mixed", "Other"] },
  supportsSpecialNeeds: Boolean,

  admissionOpen: { type: Boolean, default: true },
  admissionFee: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "EGP" },
    isRefundable: { type: Boolean, default: false }
  },

  documentsRequired: [String], // e.g. ["Birth Certificate", "Vaccination Card"]

  feesRange: {
    min: Number,
    max: Number
  },

  logoUrl: String,
  website: String,
  approved: { type: Boolean, default: false }, // platform admin approval

}, { timestamps: true });

export default mongoose.models.School || mongoose.model("School", schoolSchema);
