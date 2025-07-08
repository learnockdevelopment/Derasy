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
        name: "Cairo American College",
        slug: "cairo-american-college",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Maadi Branch",
            governorate: "Cairo",
            zone: "Maadi",
            address: "1 Midan Digla, Maadi, Cairo",
            contactEmail: "info@cacegypt.org",
            contactPhone: "0227585555",
            coordinates: { lat: 29.9601, lng: 31.2587 },
            facilities: ["Science Labs", "Performing Arts Center", "Sports Fields", "Library"]
          }
        ],
        gradesOffered: ["Pre-K", "KG1", "KG2", "Primary 1-6", "Middle 7-8", "High 9-12"],
        ageRequirement: { "Pre-K": 4, KG1: 5, KG2: 6, Primary1: 7 },
        languages: ["English", "Arabic", "French"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 15000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Vaccination Record", "Previous School Reports"],
        feesRange: {
          min: 150000,
          max: 300000
        },
        logoUrl: "https://example.com/logos/cac.png",
        website: "https://www.cacegypt.org",
        approved: true
      },
      {
        name: "Modern English School Cairo",
        slug: "modern-english-school-cairo",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "South of Police Academy, New Cairo",
            contactEmail: "admissions@mescairo.com",
            contactPhone: "0226172000",
            coordinates: { lat: 30.0250, lng: 31.4635 },
            facilities: ["Sports Hall", "Library", "Computer Labs", "Art Studios"]
          }
        ],
        gradesOffered: ["FS1", "FS2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { FS1: 3, FS2: 4, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Parent ID Copy", "Vaccination Card"],
        feesRange: {
          min: 100000,
          max: 200000
        },
        logoUrl: "https://example.com/logos/mescairo.png",
        website: "https://www.mescairo.com",
        approved: true
      },
      {
        name: "Maadi British International School",
        slug: "maadi-british-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Maadi Branch",
            governorate: "Cairo",
            zone: "Maadi",
            address: "4/2 Zahraa El Maadi, Cairo",
            contactEmail: "info@mbisegypt.com",
            contactPhone: "0225196500",
            coordinates: { lat: 29.9605, lng: 31.2568 },
            facilities: ["Science Labs", "Sports Hall", "Library", "Music Rooms"]
          }
        ],
        gradesOffered: ["FS1", "FS2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { FS1: 3, FS2: 4, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 12000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Previous School Reports"],
        feesRange: {
          min: 120000,
          max: 250000
        },
        logoUrl: "https://example.com/logos/mbis.png",
        website: "https://www.mbisegypt.com",
        approved: true
      },
      {
        name: "International School of Choueifat",
        slug: "choueifat-cairo",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "5th Settlement, New Cairo",
            contactEmail: "info@isc-cairo.sabis.net",
            contactPhone: "0225659000",
            coordinates: { lat: 30.0200, lng: 31.4667 },
            facilities: ["Theater", "Sports Fields", "Science Labs", "Library"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic", "French"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: false,
        admissionFee: {
          amount: 8000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 90000,
          max: 180000
        },
        logoUrl: "https://example.com/logos/choueifat.png",
        website: "https://www.isc-cairo.sabis.net",
        approved: true
      },
      {
        name: "British Columbia Canadian International School",
        slug: "british-columbia-canadian",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "El-Tawba Mosque, New Cairo",
            contactEmail: "info@bccis.ca",
            contactPhone: "0226171000",
            coordinates: { lat: 30.0300, lng: 31.4700 },
            facilities: ["Library", "Sports Hall", "Computer Labs"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic", "French"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Vaccination Record"],
        feesRange: {
          min: 110000,
          max: 220000
        },
        logoUrl: "https://example.com/logos/bccis.png",
        website: "https://www.bccis.ca",
        approved: true
      },
      {
        name: "American International School in Egypt",
        slug: "american-international-egypt",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Main Campus",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "5th Settlement, New Cairo",
            contactEmail: "admissions@aisegypt.com",
            contactPhone: "0226176000",
            coordinates: { lat: 30.0150, lng: 31.4650 },
            facilities: ["STEAM Labs", "Swimming Pool", "Gymnasium", "Library"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 15000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Previous School Reports"],
        feesRange: {
          min: 130000,
          max: 260000
        },
        logoUrl: "https://example.com/logos/aisegypt.png",
        website: "https://www.aisegypt.com",
        approved: true
      },
      {
        name: "Lycée Français du Caire",
        slug: "lycee-francais-caire",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Maadi Branch",
            governorate: "Cairo",
            zone: "Maadi",
            address: "7 Road 12, Maadi, Cairo",
            contactEmail: "info@lfcaire.org",
            contactPhone: "0223584000",
            coordinates: { lat: 29.9590, lng: 31.2570 },
            facilities: ["Sports Facilities", "Library", "Science Labs"]
          }
        ],
        gradesOffered: ["Maternelle", "Primary 1-6", "Collège 7-9", "Lycée 10-12"],
        ageRequirement: { Maternelle: 3, Primary1: 6 },
        languages: ["French", "Arabic", "English"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 12000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Vaccination Record"],
        feesRange: {
          min: 100000,
          max: 200000
        },
        logoUrl: "https://example.com/logos/lfcaire.png",
        website: "https://www.lfcaire.org",
        approved: true
      },
      {
        name: "Malvern College Egypt",
        slug: "malvern-college-egypt",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "B2, South of Police Academy, New Cairo",
            contactEmail: "admissions@malverncollege.org.eg",
            contactPhone: "0226172000",
            coordinates: { lat: 30.0250, lng: 31.4630 },
            facilities: ["Science Labs", "Sports Fields", "Theater", "Library"]
          }
        ],
        gradesOffered: ["FS1", "FS2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { FS1: 3, FS2: 4, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 15000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Previous School Reports"],
        feesRange: {
          min: 140000,
          max: 280000
        },
        logoUrl: "https://example.com/logos/malvern.png",
        website: "https://www.malverncollege.org.eg",
        approved: true
      },
      {
        name: "New Cairo British International School",
        slug: "new-cairo-british",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "1st Settlement, New Cairo",
            contactEmail: "info@ncbis.edu.eg",
            contactPhone: "0227583000",
            coordinates: { lat: 30.0300, lng: 31.4650 },
            facilities: ["Sports Hall", "Library", "Science Labs", "Art Rooms"]
          }
        ],
        gradesOffered: ["FS1", "FS2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { FS1: 3, FS2: 4, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 110000,
          max: 230000
        },
        logoUrl: "https://example.com/logos/ncbis.png",
        website: "https://www.ncbis.edu.eg",
        approved: true
      },
      {
        name: "El Alsson British & American International School",
        slug: "el-alsson-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Giza Branch",
            governorate: "Giza",
            zone: "6th October",
            address: "Saqqara Road, Giza",
            contactEmail: "info@alsson.com",
            contactPhone: "0238857000",
            coordinates: { lat: 29.9700, lng: 30.9400 },
            facilities: ["Sports Fields", "Library", "Science Labs", "Music Rooms"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 12000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Previous School Reports"],
        feesRange: {
          min: 120000,
          max: 240000
        },
        logoUrl: "https://example.com/logos/alsson.png",
        website: "https://www.alsson.com",
        approved: true
      },
      {
        name: "Deutsche Schule der Borobäer",
        slug: "deutsche-schule-borobaeer",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Zamalek Branch",
            governorate: "Cairo",
            zone: "Zamalek",
            address: "20 Taha Hussein St, Zamalek",
            contactEmail: "info@dsbcairo.de",
            contactPhone: "0227352700",
            coordinates: { lat: 30.0600, lng: 31.2200 },
            facilities: ["Science Labs", "Library", "Sports Facilities"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["German", "Arabic", "English"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Passport Copy", "Vaccination Record"],
        feesRange: {
          min: 100000,
          max: 200000
        },
        logoUrl: "https://example.com/logos/dsbcairo.png",
        website: "https://www.dsbcairo.de",
        approved: true
      },
      {
        name: "Manor House International School",
        slug: "manor-house-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "New Cairo Branch",
            governorate: "Cairo",
            zone: "New Cairo",
            address: "5th Settlement, New Cairo",
            contactEmail: "admissions@manorhouseschool.com",
            contactPhone: "0226173000",
            coordinates: { lat: 30.0200, lng: 31.4660 },
            facilities: ["Sports Hall", "Library", "Science Labs"]
          }
        ],
        gradesOffered: ["FS1", "FS2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { FS1: 3, FS2: 4, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 100000,
          max: 200000
        },
        logoUrl: "https://example.com/logos/manorhouse.png",
        website: "https://www.manorhouseschool.com",
        approved: true
      },
      {
        name: "Green Land International School",
        slug: "green-land-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Giza Branch",
            governorate: "Giza",
            zone: "6th October",
            address: "Dream Land, 6th October City",
            contactEmail: "info@greenlandschool.org",
            contactPhone: "0238912000",
            coordinates: { lat: 29.9750, lng: 30.9410 },
            facilities: ["Sports Fields", "Library", "Computer Labs"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 8000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Previous School Reports"],
        feesRange: {
          min: 90000,
          max: 180000
        },
        logoUrl: "https://example.com/logos/greenland.png",
        website: "https://www.greenlandschool.org",
        approved: true
      },
      {
        name: "Nefertari International School",
        slug: "nefertari-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "6th October Branch",
            governorate: "Giza",
            zone: "6th October",
            address: "Wahat Road, 6th October City",
            contactEmail: "info@nefertari-eg.com",
            contactPhone: "0238915000",
            coordinates: { lat: 29.9700, lng: 30.9400 },
            facilities: ["Science Labs", "Sports Hall", "Library"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["English", "Arabic", "German"],
        isReligious: false,
        religionType: "Mixed",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 10000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 100000,
          max: 200000
        },
        logoUrl: "https://example.com/logos/nefertari.png",
        website: "https://www.nefertari-eg.com",
        approved: true
      },
      {
        name: "Al-Hoda International School",
        slug: "al-hoda-international",
        type: "International",
        ownership: {
          owner: "686bf8587223ce52dd5527ad",
          moderators: []
        },
        branches: [
          {
            name: "Nasr City Branch",
            governorate: "Cairo",
            zone: "Nasr City",
            address: "Mostafa El-Nahhas St, Nasr City",
            contactEmail: "info@alhoda-school.com",
            contactPhone: "0222712000",
            coordinates: { lat: 30.0550, lng: 31.3450 },
            facilities: ["Library", "Sports Hall", "Computer Labs"]
          }
        ],
        gradesOffered: ["KG1", "KG2", "Primary 1-6", "Secondary 7-12"],
        ageRequirement: { KG1: 4, KG2: 5, Primary1: 6 },
        languages: ["Arabic", "English"],
        isReligious: true,
        religionType: "Muslim",
        supportsSpecialNeeds: true,
        admissionFee: {
          amount: 8000,
          currency: "EGP",
          isRefundable: false
        },
        documentsRequired: ["Birth Certificate", "Vaccination Card", "Parent ID Copy"],
        feesRange: {
          min: 80000,
          max: 160000
        },
        logoUrl: "https://example.com/logos/alhoda.png",
        website: "https://www.alhoda-school.com",
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
