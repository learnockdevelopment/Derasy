import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return Response.json({ message: 'Email is already verified' }, { status: 200 });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otpCode, expiresAt: otpExpires };
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const emailHtml = `
      <div style="background: #f9f9f9; font-family: 'Cairo', sans-serif; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616489.png" width="60" alt="OTP Icon" />
          <h2 style="color: #2e86de;">رمز التحقق الخاص بك</h2>
        </div>
        <p style="font-size: 16px; color: #2d3436;">مرحبًا ${user.name} 👋</p>
        <p style="font-size: 15px; color: #444;">لقد طلبت رمز التحقق لإتمام عملية التسجيل. استخدم الكود التالي:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; color: #2e86de;">${otpCode}</div>
        <p style="font-size: 13px; color: #888; text-align: center;">الرمز صالح لمدة 10 دقائق فقط</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          إذا لم تقم بطلب هذا، يمكنك تجاهل هذه الرسالة.
        </p>
        <p style="font-size: 12px; color: #bbb; text-align: center;">© ${new Date().getFullYear()} منصة تقديم المدارس</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to: user.email,
      subject: '🔐 رمز التحقق من بريدك الإلكتروني',
      html: emailHtml
    });

    console.log("📤 Email sent response:", info);

    return Response.json({ message: 'OTP sent successfully. Please check your email.' });

  } catch (error) {
    console.error("❌ Error resending OTP:", error);
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
