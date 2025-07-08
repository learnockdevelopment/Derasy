import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'البريد الإلكتروني غير مسجل' }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Save OTP to user document
    user.otp = { code: otp, expiresAt };
    await user.save();

    // Create mail transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
  from: `"منصة دراسي" <${process.env.MAIL_FROM_ADDRESS}>`,
  to: email,
  subject: '🔐 رمز التحقق لاستعادة كلمة المرور',
  html: `
    <div style="font-family: 'Cairo', sans-serif; direction: rtl; background-color: #f9fafb; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px; border: 1px solid #e2e8f0;">
        <h2 style="color: #3b82f6; margin-bottom: 20px;">🔐 رمز استعادة كلمة المرور</h2>

        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          لقد طلبت إعادة تعيين كلمة المرور الخاصة بك على <strong>منصة دراسي</strong>.
          <br />
          رمز التحقق الخاص بك هو:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111827; background-color: #f3f4f6; padding: 16px 32px; border-radius: 8px; border: 2px dashed #3b82f6;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          ⏰ هذا الرمز صالح لمدة <strong>15 دقيقة</strong> فقط.
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="font-size: 13px; color: #9ca3af; text-align: center;">
          © ${new Date().getFullYear()} منصة دراسي. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  `,
});


    return Response.json({ message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' });
  } catch (error) {
    console.error('❌ Error in OTP request:', error);
    return Response.json({ message: 'فشل إرسال الرمز', error: error.message }, { status: 500 });
  }
}
