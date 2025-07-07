import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import User from '@/models/User';
import { authenticate } from '@/middlewares/auth';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const childrenData = Array.isArray(body) ? body : [body];

    const parentUser = await User.findById(user.id);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const savedChildren = [];

    for (const data of childrenData) {
      if (!data.fullName || !data.gender || !data.birthDate || !data.desiredGrade) {
        return Response.json({ message: 'Missing required fields in one or more children' }, { status: 400 });
      }

      const child = await Child.create({
        ...data,
        parent: user.id,
      });

      savedChildren.push(child);

      const mailHtml = `
        <div style="font-family: 'Cairo', sans-serif; background: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); animation: fadeIn 1s ease-out;">
            <h2 style="text-align: center; color: #2c3e50;">✅ تم تسجيل طفلك بنجاح</h2>
            <p style="text-align: center;">👋 مرحبًا <strong>${parentUser.name}</strong>، شكراً لتسجيل طفلك <strong>${data.fullName}</strong> في منصتنا.</p>

            <p style="font-size: 14px; color: #636e72; text-align: center;">📌 تم حفظ البيانات بنجاح وسنقوم بتحليلها واقتراح أفضل المدارس.</p>

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

      await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: parentUser.email,
        subject: `📥 تأكيد تسجيل الطفل ${data.fullName}`,
        html: mailHtml
      });
    }

    return Response.json({
      message: `${savedChildren.length} child(ren) added successfully`,
      children: savedChildren
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error adding child(ren):', error);
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
