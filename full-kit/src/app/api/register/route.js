import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    console.log("🔄 Connecting to DB...");
    await dbConnect();
    console.log("✅ Connected to DB");

    const { name, email, password, role = 'parent' } = await req.json();
    
    if (!name || !email || !password || !role) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }
const existingUser = await User.findOne({ email });
    if (existingUser) {
  if (!existingUser.emailVerified) {
    // Generate new OTP
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update the user with new OTP
    existingUser.otp.code = newOtpCode;
    existingUser.otp.expiresAt = newOtpExpires;
    await existingUser.save();

    // Send the new OTP email
    const emailHtml = `
      <div style="font-family: 'Cairo', sans-serif; padding: 30px; background: #f9f9f9; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #eee;">
        <h2 style="color: #2e86de;">رمز التحقق الخاص بك</h2>
        <p style="font-size: 16px; color: #333;">مرحبًا ${existingUser.name} 👋، لقد طلبت رمز تحقق جديد من منصة دراسي.</p>
        <p style="font-size: 16px; color: #333;">يرجى استخدام رمز التحقق التالي لإكمال تفعيل حسابك:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; color: #2e86de;">${newOtpCode}</div>
        <p style="font-size: 14px; color: #777;">هذا الرمز صالح لمدة 10 دقائق فقط.</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to: existingUser.email,
      subject: 'رمز التحقق من البريد الإلكتروني',
      html: emailHtml
    });

    return Response.json({
      message: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني. الرجاء التحقق لإكمال التسجيل.",
    });
  }

  return Response.json({
    message: "البريد الإلكتروني مستخدم بالفعل.",
  }, { status: 400 });
}


    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // Create user with OTP
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      emailVerified: false,
      otp: {
        code: otpCode,
        expiresAt: otpExpires
      }
    });

    console.log("✅ User created:", user._id);

    // Validate email configs
    if (
      !process.env.MAIL_HOST ||
      !process.env.MAIL_PORT ||
      !process.env.MAIL_USERNAME ||
      !process.env.MAIL_PASSWORD ||
      !process.env.MAIL_FROM_ADDRESS
    ) {
      throw new Error('Missing required email environment variables');
    }

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
      <div style="font-family: 'Cairo', sans-serif; padding: 30px; background: #f9f9f9; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #eee;">
        <h2 style="color: #2e86de;">رمز التحقق الخاص بك</h2>
        <p style="font-size: 16px; color: #333;">مرحبًا ${name} 👋، شكرًا لتسجيلك في منصة دراسي.</p>
        <p style="font-size: 16px; color: #333;">يرجى استخدام رمز التحقق التالي لإكمال تفعيل حسابك:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; color: #2e86de;">${otpCode}</div>
        <p style="font-size: 14px; color: #777;">هذا الرمز صالح لمدة 10 دقائق فقط.</p>
      </div>
    `;

    console.log("📤 Sending OTP email to:", email);
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to: email,
      subject: 'رمز التحقق من البريد الإلكتروني',
      html: emailHtml
    });

    console.log("✅ OTP Email sent:", info.messageId);

    return Response.json({ message: 'User created. Please check your email for the verification code.' });

  } catch (error) {
    console.error("❌ Error in signup:", error);
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
