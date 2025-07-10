import { authenticate } from "@/middlewares/auth"
import Application from "@/models/Application"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import { method } from "lodash"

import { dbConnect } from "@/lib/dbConnect"
import { sendEmail } from "@/lib/sendEmail"

export async function POST(req) {
  await dbConnect()
  const user = await authenticate(req)
  if (!user || user.role !== "parent") return user
  const parentUser = await User.findById(user.id)
  const { childId, selectedSchools } = await req.json()
  if (
    !childId ||
    !Array.isArray(selectedSchools) ||
    selectedSchools.length === 0
  ) {
    return Response.json({ message: "بيانات غير كاملة" }, { status: 400 })
  }

  // ترتيب المدارس حسب الأعلى في رسوم التقديم
  const sortedSchools = selectedSchools.sort(
    (a, b) => (b.admissionFee?.amount || 0) - (a.admissionFee?.amount || 0)
  )

  const topSchool = sortedSchools[0]
  const admissionFee = topSchool.admissionFee?.amount || 0

  // احضر بيانات المستخدم من قاعدة البيانات
  const dbUser = await User.findById(user.id)

  if (!dbUser || dbUser.wallet.balance < admissionFee) {
    return Response.json(
      {
        message: `رصيدك غير كافٍ. تحتاج إلى ${admissionFee} جنيه على الأقل.`,
      },
      { status: 400 }
    )
  }

  // خصم رسوم التقديم
  dbUser.wallet.balance -= admissionFee
  await dbUser.save()

  // سجل عملية الدفع
  await Transaction.create({
    user: user.id,
    type: "withdraw",
    amount: admissionFee,
    method: "wallet",
    description: `رسوم التقديم لمدرسة ${topSchool.name}`,
  })
  await Transaction.create({
    user: topSchool.ownership.owner._id, // ✅ the school owner's ID
    type: "hold_income",
    amount: admissionFee,
    method: "wallet",
    description: `رسوم التقديم لمدرسة ${topSchool.name}`,
  })
  // Fetch the owner user data
  const ownerUser = await User.findById(topSchool.ownership.owner._id)

  // Send email to parent
  await sendEmail({
    to: parentUser.email,
    subject: `🧾 تم خصم رسوم التقديم لمدرسة ${topSchool.name}`,
    html: `
    <div style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; background-color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #eee;">
      <h2 style="color: #dc2626;">💳 تم خصم رسوم التقديم</h2>
      <p style="font-size: 15px; color: #333;">${parentUser.name} العزيز،</p>
      <p style="font-size: 14px; color: #555;">
        تم خصم مبلغ <strong>${admissionFee.toLocaleString("ar-EG")} جنيه</strong> من محفظتك لتقديم طلب إلى مدرسة <strong>${topSchool.name}</strong>.
      </p>
      <p style="font-size: 13px; color: #999;">مع تحيات منصة Learnock</p>
    </div>
  `,
  })

  // Send email to school owner
  await sendEmail({
    to: ownerUser.email,
    subject: `📥 تم إضافة طلب جديد إلى مدرستك ${topSchool.name}`,
    html: `
    <div style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; background-color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #eee;">
      <h2 style="color: #10b981;">📬 طلب تقديم جديد</h2>
      <p style="font-size: 15px; color: #333;">${ownerUser.name} المحترم،</p>
      <p style="font-size: 14px; color: #555;">
        تم تقديم طلب جديد إلى مدرستك <strong>${topSchool.name}</strong> من قبل ولي الأمر <strong>${parentUser.name}</strong>.
        وقد تم حجز مبلغ <strong>${admissionFee.toLocaleString("ar-EG")} جنيه</strong> كمعلّق حتى إتمام العملية.
      </p>
      <p style="font-size: 13px; color: #999;">تابع الطلبات من خلال لوحة التحكم.</p>
    </div>
  `,
  })

  // إنشاء الطلبات
  const results = []
  for (let i = 0; i < sortedSchools.length; i++) {
    const school = sortedSchools[i]
    const status = i === 0 ? "pending" : "draft"

    const application = await Application.create({
      parent: user.id,
      child: childId,
      school: school._id,
      status,
      payment: {
        isPaid: status === "pending",
        amount: status === "pending" ? admissionFee : 0,
      },
      preferredInterviewSlots: [
        {
          date: new Date(),
          timeRange: { from: "10:00", to: "12:00" },
        },
      ],
    })

    results.push(application)

    // 🔔 Send email for each application
    await sendEmail({
      to: parentUser.email,
      subject:
        status === "pending"
          ? `📬 تم تقديم طلبك إلى ${school.name}`
          : `📝 تم حفظ طلبك إلى ${school.name} كمسودة`,
      html: `
      <div style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; background-color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #eee;">
        <h2 style="color: ${status === "pending" ? "#10b981" : "#f59e0b"};">
          ${status === "pending" ? "✅ تم تقديم الطلب" : "📝 تم حفظ الطلب كمسودة"}
        </h2>
        <p style="font-size: 15px; color: #333;">
          ${parentUser.name} العزيز،
        </p>
        <p style="font-size: 15px; color: #555;">
          ${
            status === "pending"
              ? `تم تقديم طلبك بنجاح إلى مدرسة <strong>${school.name}</strong> وقد تم خصم مبلغ <strong>${admissionFee.toLocaleString("ar-EG")} جنيه</strong> من محفظتك.`
              : `تم حفظ طلبك إلى مدرسة <strong>${school.name}</strong> كمسودة ويمكنك تأكيده لاحقًا.`
          }
        </p>
        <div style="margin-top: 20px;">
          <a href="https://yourdomain.com/dashboard/applications" style="display: inline-block; background-color: #7c3aed; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
            متابعة طلباتي
          </a>
        </div>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">
          هذا البريد تم إرساله تلقائيًا. لا ترد عليه.
        </p>
      </div>
    `,
    })
  }

  await sendEmail({
    to: parentUser.email,
    subject: "✅ تأكيد تقديم طلبات المدارس",
    html: `
    <div style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #e0e0e0;">
      <div style="text-align: center;">
        <img src="https://learnock.com/logo.png" alt="Logo" style="width: 120px; margin-bottom: 20px;" />
        <h2 style="color: #4c1d95;">✅ تم تقديم طلب التقديم بنجاح</h2>
      </div>

      <p style="font-size: 16px; color: #333;">عزيزي ${parentUser.name}،</p>

      <p style="font-size: 15px; color: #555; line-height: 1.7;">
        نشكرك على استخدام منصتنا لاختيار المدارس المناسبة لطفلك.
        نود إعلامك أنه قد تم خصم مبلغ <strong style="color: #10b981;">${admissionFee.toLocaleString("ar-EG")} جنيه</strong> من محفظتك الإلكترونية،
        وتم تقديم الطلب بنجاح إلى مدرسة <strong>${sortedSchools[0].name}</strong>.
      </p>

      <p style="font-size: 15px; color: #555;">
        تم أيضاً حفظ باقي الطلبات كمسودات حتى يتم تأكيدها لاحقاً.
      </p>

      <div style="background-color: #f0f0ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
        <p style="margin: 0; font-size: 15px; color: #4c1d95;">
          📌 عدد المدارس المختارة: <strong>${results.length}</strong><br />
          🏫 مدرسة التقديم الفعلي: <strong>${sortedSchools[0].name}</strong><br />
          💰 الرسوم المدفوعة: <strong>${admissionFee.toLocaleString("ar-EG")} جنيه</strong>
        </p>
      </div>

      <p style="font-size: 15px; color: #555;">يمكنك متابعة حالة طلباتك من خلال لوحة التحكم الخاصة بك.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://yourdomain.com/dashboard/applications" style="background-color: #7c3aed; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
          عرض الطلبات الخاصة بي
        </a>
      </div>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 13px; color: #999; text-align: center;">
        هذا البريد تم إرساله تلقائياً من منصة التقديم. لا ترد عليه مباشرة.
      </p>
    </div>
  `,
  })

  return Response.json({
    message: "✅ تم إنشاء الطلبات بنجاح",
    applications: results,
  })
}
