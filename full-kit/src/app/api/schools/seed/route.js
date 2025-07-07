// === app/api/schools/seed/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await dbConnect();

    const owner = await User.findOne();
    if (!owner) {
      return NextResponse.json({ message: 'No user found. Please create a user first.' }, { status: 400 });
    }

    const schools = [
      {
        name: "Al-Noor International School",
        slug: "al-noor-international",
        type: "International",
        ownership: {
          owner: owner._id,
          moderators: []
        },
        branches: [
          {
            name: "Main Branch",
            governorate: "Cairo",
            zone: "Nasr City",
            address: "123 Main Street",
            contactEmail: "info@alnoor.edu.eg",
            contactPhone: "0123456789",
            coordinates: { lat: 30.0444, lng: 31.2357 },
            facilities: ["Sports Hall", "Library", "Bus Service"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1", "Primary 2"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["Arabic", "English"],
        isReligious: true,
        religionType: "Muslim",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 3000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 25000,
          max: 45000
        },
        logoUrl: "https://example.com/logos/alnoor.png",
        website: "https://alnoor.edu.eg",
        approved: true
      },
      {
        name: "Future Stars Private School",
        slug: "future-stars",
        type: "Private",
        ownership: {
          owner: owner._id,
          moderators: []
        },
        branches: [
          {
            name: "October Branch",
            governorate: "Giza",
            zone: "6th October",
            address: "456 School Road",
            contactEmail: "info@futurestars.edu.eg",
            contactPhone: "01111111111",
            coordinates: { lat: 29.9765, lng: 30.9425 },
            facilities: ["Computer Lab", "Playground", "Clinic"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1", "Primary 2", "Primary 3"],
        ageRequirement: { KG1: 3.5, KG2: 4.5, Primary1: 6 },
        languages: ["Arabic", "English", "French"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: false,
        admissionFee: {
          amount: 2000,
          currency: "EGP",
          isRefundable: true
        },
        documentsRequired: ["Birth Certificate", "Family Card Copy"],
        feesRange: {
          min: 18000,
          max: 32000
        },
        logoUrl: "https://example.com/logos/futurestars.png",
        website: "https://futurestars.edu.eg",
        approved: true
      }
    ];

    await School.insertMany(schools);
    return NextResponse.json({ message: '✅ Schools inserted successfully.' });
  } catch (error) {
    console.error('❌ Error seeding schools:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
