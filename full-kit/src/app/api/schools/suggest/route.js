import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import School from '@/models/School';
import User from '@/models/User';
import { authenticate } from '@/middlewares/auth';
import { marked } from 'marked';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withLogging } from '@/middlewares/logger';
import nodemailer from 'nodemailer';

async function handler(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get parent and their children
    const parentUser = await User.findById(user.id);
    const children = await Child.find({ parent: user.id });
    if (!children || children.length === 0) {
      return Response.json({ message: 'No children found for this user' }, { status: 404 });
    }

    // Get approved schools
    const schools = await School.find({ approved: true });

    // Prepare prompt for Gemini
    const prompt = `
      Based on the following Egyptian family's school application data, suggest the most suitable schools from the provided list.

      ## Children:
      ${JSON.stringify(children, null, 2)}

      ## Schools:
      ${JSON.stringify(schools, null, 2)}

      Provide the suggestions in Arabic and use markdown formatting. For each child, suggest 3 suitable schools and explain why they match the child's profile (grade, location, special needs, religion, etc.).
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const markdownSuggestions = geminiResponse.text();
    const htmlSuggestions = marked(markdownSuggestions);

    // Send Email to Parent
    const emailHtml = `
      <div style="font-family: 'Cairo', Tahoma, Arial, sans-serif; background: #f4f4f4; padding: 20px; direction: rtl; text-align: right;">
        <div style="max-width: 100%; margin: auto; background: white; border-radius: 12px; padding: 20px 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); animation: fadeIn 1s ease-out;">
          <h2 style="text-align: center; color: #2c3e50;">🏫 ترشيحات المدارس المناسبة لأطفالك</h2>
          <p style="text-align: center;">🔍 هذا البريد يحتوي على تحليل وترشيح مخصص لأطفالك بناءً على بياناتهم والمدارس المتاحة.</p>
          <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 15px; color: #2d3436; line-height: 1.8;">${htmlSuggestions}</div>
          </div>
          <p style="font-size: 14px; color: #636e72; text-align: center;">📌 يمكنك الاطلاع على الترشيحات أيضًا من خلال حسابك على المنصة.</p>
          <div style="text-align: center; margin-top: 40px;">
            <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" width="60" alt="Success Icon" />
            <p style="font-size: 12px; color: #b2bec3; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} منصة دراسي | جميع الحقوق محفوظة
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
      subject: '🏫 ترشيحات المدارس المناسبة لأطفالك',
      html: emailHtml
    });

    return Response.json({
      message: 'Suggestions generated and sent via email.',
      markdown: markdownSuggestions,
      html: htmlSuggestions
    });

  } catch (error) {
    console.error('❌ Error suggesting schools:', error);
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export const POST = withLogging(handler);
