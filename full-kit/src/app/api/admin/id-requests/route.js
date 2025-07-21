import { authenticate } from "@/middlewares/auth"
import StudentIdCardRequest from '@/models/StudentCard';
import { dbConnect } from "@/lib/dbConnect"

export async function GET(req) {
  try {
    // الاتصال بقاعدة البيانات
    await dbConnect()

    // التحقق من المستخدم
    const user = await authenticate(req)
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    // جلب كل الطلبات
    const requests = await StudentIdCardRequest.find({})
      .populate("school") // جلب اسم المدرسة
      .populate("student") // جلب بيانات الطالب
      .sort({ createdAt: -1 })
      .lean()

    return Response.json({ requests }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching ID requests:", error)
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    )
  }
}
