import User from "@/models/User"
import { hash } from "bcryptjs"
import nodemailer from "nodemailer"

import { dbConnect } from "@/lib/dbConnect"

function extractNameFromEmail(email) {
  const username = email.split("@")[0]
  return username.replace(/[^a-zA-Z0-9]/g, " ")
}

function generateTempPassword(length = 8) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!"
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
}

export async function POST(req) {
  try {
    await dbConnect()

    const body = await req.json()
    const email = body.email

    if (!email) {
      return Response.json(
        { message: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      )
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 3 * 60 * 1000) // expires in 3 minutes
    const nameFromEmail = extractNameFromEmail(email)
    const tempPassword = generateTempPassword()

    let user = await User.findOne({ email })

    if (!user) {
      const hashedPassword = await hash(tempPassword, 10)

      user = await User.create({
        name: nameFromEmail,
        email,
        role: "parent",
        emailVerified: false,
        password: hashedPassword,
        otp: {
          code: otpCode,
          expiresAt: otpExpires,
        },
      })
    } else {
      user.otp = {
        code: otpCode,
        expiresAt: otpExpires,
      }
      await user.save()
    }
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })
    const emailHtml = `
<div style="font-family: 'Cairo', Arial, sans-serif; padding: 30px; background: #f9f9f9; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #eee; direction: rtl; text-align: right;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #2e86de; margin: 0; font-size: 24px;">منصة دراسي</h1>
  </div>
  
  <div style="background: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <h2 style="color: #2e86de; margin-top: 0; font-size: 20px;">مرحبًا ${nameFromEmail} 👋</h2>
    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">شكرًا لاستخدامك منصة دراسي. يرجى استخدام المعلومات التالية:</p>
    
    <div style="margin-bottom: 25px;">
      <p style="font-size: 15px; color: #555; margin-bottom: 8px;">رمز التحقق الخاص بك:</p>
      <div style="text-align: center; font-size: 28px; font-weight: bold; margin: 15px 0; color: #2e86de; letter-spacing: 3px;">${otpCode}</div>
      <p style="font-size: 13px; color: #777; text-align: center;">هذا الرمز صالح لمدة 10 دقائق فقط</p>
    </div>
    
    ${
      !user.emailVerified
        ? `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #2e86de;">
          <p style="font-size: 15px; color: #555; margin-bottom: 8px;">كلمة المرور المؤقتة:</p>
          <div style="font-size: 18px; font-weight: bold; color: #333; padding: 8px 12px; background: #fff; border-radius: 4px; display: inline-block; border: 1px dashed #ddd;">${tempPassword}</div>
          <p style="font-size: 13px; color: #777; margin-top: 8px;">يرجى تغييرها بعد تسجيل الدخول</p>
        </div>
        `
        : ""
    }
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="font-size: 14px; color: #777; margin-bottom: 5px;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
      <p style="font-size: 14px; color: #777;">فريق دراسي</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 25px;">
    <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} منصة دراسي. جميع الحقوق محفوظة.</p>
  </div>
</div>
`
    await transporter.sendMail({
      from: `"منصة دراسي" <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: "رمز التحقق وكلمة المرور المؤقتة",
      html: emailHtml,
    })

    return Response.json(
      { message: "تم إرسال رمز التحقق إلى البريد الإلكتروني" },
      { status: 200 }
    )
  } catch (err) {
    console.error("❌ Error in OTP route:", err)
    return Response.json(
      { message: "حدث خطأ أثناء إرسال رمز التحقق" },
      { status: 500 }
    )
  }
}
