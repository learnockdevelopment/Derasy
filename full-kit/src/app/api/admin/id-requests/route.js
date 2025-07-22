import { authenticate } from "@/middlewares/auth"
import StudentIdCardRequest from '@/models/StudentCard'
import { dbConnect } from "@/lib/dbConnect"

export async function GET(req) {
  try {
    console.log("🚀 Starting GET /api/student-id-card-requests")

    // الاتصال بقاعدة البيانات
    await dbConnect()
    console.log("✅ Database connected")

    // التحقق من المستخدم
    const user = await authenticate(req)
    console.log("👤 Authenticated user:", user)

    if (!user || user.message || user.role !== "admin") {
      console.warn("❌ Unauthorized access attempt")
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    // قراءة البارامترات من URL
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("q")?.trim()
    const startDate = searchParams.get("from")
    const endDate = searchParams.get("to")
    console.log("🔍 Query params:", searchParams)

    // بناء الفلتر
    let filter = {}

    if (keyword) {
      const regex = new RegExp(keyword, "i")
      filter.$or = [
        { status: regex },
        { customFields: { $elemMatch: { value: regex } } }
      ]
      console.log("🔎 Added keyword filter:", filter.$or)
    }

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate)
        console.log("📅 Filter from date:", filter.createdAt.$gte)
      }
      if (endDate) {
        const nextDay = new Date(endDate)
        nextDay.setDate(nextDay.getDate() + 1)
        filter.createdAt.$lt = nextDay
        console.log("📅 Filter to date:", filter.createdAt.$lt)
      }
    }

    console.log("🧾 Final MongoDB filter:", filter)

    const requests = await StudentIdCardRequest.find(filter)
      .populate("school", "name")
      .populate("student", "fullName email nationalId")
      .sort({ createdAt: -1 })
      .lean()

    console.log(`✅ Fetched ${requests.length} request(s)`)

    return Response.json({ requests }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching ID requests:", error)
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    )
  }
}
