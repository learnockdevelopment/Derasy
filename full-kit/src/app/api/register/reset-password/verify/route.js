import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "البريد الإلكتروني أو الرمز مفقود." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otp.code || !user.otp.expiresAt) {
      return NextResponse.json({ message: "لم يتم طلب رمز تحقق لهذا البريد." }, { status: 404 });
    }

    const now = new Date();
    if (user.otp.expiresAt < now) {
      return NextResponse.json({ message: "انتهت صلاحية رمز التحقق." }, { status: 400 });
    }

    if (user.otp.code !== otp) {
      return NextResponse.json({ message: "رمز التحقق غير صحيح." }, { status: 400 });
    }

    // Optional: Clear OTP after success
    user.otp = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "✅ تم التحقق من الرمز بنجاح" });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء التحقق." }, { status: 500 });
  }
}
