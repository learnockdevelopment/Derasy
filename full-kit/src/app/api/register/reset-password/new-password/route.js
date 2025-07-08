import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "📭 البريد الإلكتروني أو كلمة المرور مفقودة." },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "🚫 المستخدم غير موجود." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    // 📧 Send notification
    await sendEmail({
      to: user.email,
      subject: "✅ تم تغيير كلمة المرور",
      html: `
        <div style="font-family:'Cairo', sans-serif; direction: rtl; text-align: right;">
          <h2>تأكيد تغيير كلمة المرور</h2>
          <p>تم تغيير كلمة المرور الخاصة بك بنجاح على منصة دراسي.</p>
          <p>إذا لم تقم بهذا التغيير، يرجى التواصل مع الدعم فورًا.</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: "✅ تم تحديث كلمة المرور وإرسال إشعار بالبريد الإلكتروني.",
    });
  } catch (error) {
    console.error("Set Password Error:", error);
    return NextResponse.json(
      { success: false, message: "❌ حدث خطأ أثناء تحديث كلمة المرور." },
      { status: 500 }
    );
  }
}
