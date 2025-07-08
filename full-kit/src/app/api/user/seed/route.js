import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    const users = [
      {
        name: "ولي أمر تجريبي",
        email: "parent@derasy.com",
        password: "123456",
        role: "parent",
      },
      {
        name: "صاحب مدرسة تجريبي",
        email: "school@derasy.com",
        password: "123456",
        role: "school_owner",
      },
      {
        name: "مشرف تجريبي",
        email: "moderator@derasy.com",
        password: "123456",
        role: "moderator",
      },
      {
        name: "مدير تجريبي",
        email: "admin@derasy.com",
        password: "123456",
        role: "admin",
      },
    ];

    const results = [];

    for (const user of users) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          emailVerified: true,
        });
        results.push({ email: user.email, status: "created" });
      } else {
        results.push({ email: user.email, status: "already exists" });
      }
    }

    return NextResponse.json({ message: "✅ Seeding complete", results });
  } catch (error) {
    console.error("❌ Error seeding test users:", error);
    return NextResponse.json(
      { message: "❌ Failed to seed users", error: error.message },
      { status: 500 }
    );
  }
}
