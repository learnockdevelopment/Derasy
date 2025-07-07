// === app/api/children/analyze/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import User from '@/models/User';
import { authenticate } from '@/middlewares/auth';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked'; // ✅ convert markdown to HTML

export async function POST(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const parentUser = await User.findById(user.id);
    const children = await Child.find({ parent: user.id });

    if (!children || children.length === 0) {
      return Response.json({ message: 'No children found for this user' }, { status: 404 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Analyze the following Egyptian family's school application data for all children. Summarize in Arabic and suggest suitable school types and recommendations. Format the output in markdown.

      Here are the children data:
      ${JSON.stringify(children, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const aiAnalysis = geminiResponse.text();

    const htmlContent = marked(aiAnalysis); // ✅ Markdown to HTML

    const emailHtml = `
  <div style="font-family: 'Cairo', 'Tahoma', 'Arial', sans-serif; background: #f4f4f4; padding: 20px; direction: rtl; text-align: right;">
    <div style="max-width: 100%; margin: auto; background: white; border-radius: 12px; padding: 20px 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); animation: fadeIn 1s ease-out;">
      <h2 style="text-align: center; color: #2c3e50;">📊 تحليل بيانات أطفالك</h2>
      <p style="text-align: center;">🔍 هذا هو التحليل الخاص بأطفالك بناءً على البيانات المدخلة.</p>

      <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0984e3;">💡 التوصيات:</h3>
        <div style="font-size: 15px; color: #2d3436; line-height: 1.8;">${htmlContent}</div>
      </div>

      <p style="font-size: 14px; color: #636e72; text-align: center;">📌 سنرسل لك المزيد من الترشيحات خلال الفترة القادمة بناءً على تحليلاتنا.</p>

      <div style="text-align: center; margin-top: 40px;">
        <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" width="60" alt="Success Icon" />
        <p style="font-size: 12px; color: #b2bec3; margin-top: 10px;">
          &copy; ${new Date().getFullYear()} منصة تقديم المدارس | جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  </div>

  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
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
      to: parentUser.email,
      subject: `📊 تحليل بيانات أطفالك`,
      html: emailHtml
    });

    return Response.json({ message: 'Analysis completed and sent via email.', aiAnalysis });
  } catch (error) {
    console.error('❌ Error analyzing children:', error);
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}