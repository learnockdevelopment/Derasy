import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function sendEmail({ to, subject, html }) {
  return await transporter.sendMail({
    from: `"منصة دراسي" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
  })
}
