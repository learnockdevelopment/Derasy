import { authenticate } from "@/middlewares/auth";
import Application from "@/models/Application";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.role !== "parent") {
      return Response.json({ message: "غير مصرح" }, { status: 401 });
    }

    const parentUser = await User.findById(user.id);
    const { childId, selectedSchools } = await req.json();

    if (!childId || !Array.isArray(selectedSchools) || selectedSchools.length === 0) {
      return Response.json({ message: "بيانات غير كاملة" }, { status: 400 });
    }

    // 1️⃣ Sort schools by highest admission fee
    const sortedSchools = selectedSchools.sort(
      (a, b) => (b.admissionFee?.amount || 0) - (a.admissionFee?.amount || 0)
    );

    const topSchool = sortedSchools[0];
    const admissionFee = topSchool.admissionFee?.amount || 0;

    // 2️⃣ Check wallet balance
    const dbUser = await User.findById(user.id);
    if (!dbUser || dbUser.wallet.balance < admissionFee) {
      return Response.json({
        message: `رصيدك غير كافٍ. تحتاج إلى ${admissionFee} جنيه على الأقل.`,
      }, { status: 400 });
    }

    // 3️⃣ Check for existing application to top school
    const duplicate = await Application.findOne({
      parent: user.id,
      child: childId,
      school: topSchool._id,
      status: { $nin: ["accepted", "rejected"] }, // Only block if it's not closed
    });

    if (duplicate) {
      return Response.json({
        message: `⚠️ لديك بالفعل طلب لهذه المدرسة.`,
      }, { status: 409 });
    }

    // 4️⃣ Deduct from parent's wallet
    dbUser.wallet.balance -= admissionFee;
    await dbUser.save();

    // 5️⃣ Log withdrawal
    await Transaction.create({
      user: user.id,
      type: "withdraw",
      amount: admissionFee,
      method: "wallet",
      description: `رسوم التقديم لمدرسة ${topSchool.name}`,
    });

    // 6️⃣ Log hold income for school owner
    const ownerId = topSchool.ownership?.owner?._id;
    if (!ownerId) {
      return Response.json({
        message: `لم يتم العثور على مالك المدرسة.`,
      }, { status: 400 });
    }

    await Transaction.create({
      user: ownerId,
      type: "hold_income",
      amount: admissionFee,
      method: "wallet",
      description: `رسوم التقديم لمدرسة ${topSchool.name}`,
    });

    // 7️⃣ Send email to parent (payment confirmation)
    await sendEmail({
      to: parentUser.email,
      subject: `🧾 تم خصم رسوم التقديم لمدرسة ${topSchool.name}`,
      html: `<p>تم خصم ${admissionFee.toLocaleString("ar-EG")} جنيه من محفظتك.</p>`,
    });

    // 8️⃣ Send email to school owner
    const ownerUser = await User.findById(ownerId);
    if (ownerUser?.email) {
      await sendEmail({
        to: ownerUser.email,
        subject: `📥 تم إضافة طلب جديد إلى مدرستك ${topSchool.name}`,
        html: `<p>تم تقديم طلب جديد من ولي الأمر ${parentUser.name}.</p>`,
      });
    }

    // 9️⃣ Create applications
    const results = [];

    for (let i = 0; i < sortedSchools.length; i++) {
      const school = sortedSchools[i];

      const alreadyExists = await Application.findOne({
        parent: user.id,
        child: childId,
        school: school._id,
        status: { $nin: ["accepted", "rejected"] }, // Only block if it's not closed
      });

      if (alreadyExists) continue;

      const status = i === 0 ? "pending" : "draft";

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
      });

      results.push(application);

      // 🔔 Email per application
      await sendEmail({
        to: parentUser.email,
        subject: status === "pending"
          ? `📬 تم تقديم طلبك إلى ${school.name}`
          : `📝 تم حفظ طلبك إلى ${school.name} كمسودة`,
        html: `<p>تم تقديم الطلب إلى ${school.name}</p>`,
      });
    }

    // 🔟 Final email summary
    await sendEmail({
      to: parentUser.email,
      subject: "✅ تأكيد تقديم طلبات المدارس",
      html: `<p>تم تقديم طلبك إلى ${topSchool.name} وتم حفظ ${results.length - 1} كمسودات.</p>`,
    });

    return Response.json({
      message: "✅ تم إنشاء الطلبات بنجاح",
      applications: results,
    });

  } catch (err) {
    console.error("❌ Error in school application:", err);
    return Response.json({ message: "حدث خطأ داخلي", error: err.message }, { status: 500 });
  }
}
