import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await dbConnect();

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return Response.json({ message: 'Email and OTP are required' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  if (user.emailVerified) {
    return Response.json({ message: 'Email already verified' }, { status: 200 });
  }

  if (!user.otp?.code || !user.otp?.expiresAt) {
    return Response.json({ message: 'No OTP found for this user' }, { status: 400 });
  }

  if (user.otp.code !== otp) {
    return Response.json({ message: 'Invalid OTP' }, { status: 400 });
  }

  if (new Date(user.otp.expiresAt) < new Date()) {
    return Response.json({ message: 'OTP expired' }, { status: 400 });
  }

  // ✅ Mark email verified & clear OTP
  user.emailVerified = true;
  user.otp = undefined;
  await user.save();

  // ✅ Send a confirmation email
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const confirmationHTML = `
    <div style="background: #f8f9fa; padding: 40px 20px; font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; border-radius: 12px; border: 1px solid #ddd;">
      <h2 style="text-align:center; color:#2ecc71;">🎉 تم تأكيد بريدك الإلكتروني بنجاح!</h2>
      <p style="font-size: 15px; text-align: center; color:#333;">
        مرحبًا ${user.name}، لقد تم تفعيل حسابك بنجاح على <strong>منصة تقديم المدارس</strong>.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.BASE_URL}" style="
          background: #27ae60;
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
        ">اذهب إلى الموقع</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
        © ${new Date().getFullYear()} منصة تقديم المدارس. جميع الحقوق محفوظة.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM_ADDRESS,
    to: user.email,
    subject: '🎉 تم تأكيد بريدك الإلكتروني بنجاح',
    html: confirmationHTML
  });

  return Response.json({ message: 'Email verified successfully and confirmation sent' });
}
