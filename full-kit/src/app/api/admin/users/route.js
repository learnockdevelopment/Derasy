import { authenticate } from "@/middlewares/auth"
import User from "@/models/User"

import { dbConnect } from "@/lib/dbConnect"

export async function GET(req) {
  try {
    // Connect to DB
    await dbConnect()

    // Authenticate the requester
    const user = await authenticate(req)
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get all users
    const users = await User.find({})
      .select("name email role status createdAt") // Only necessary fields
      .sort({ createdAt: -1 })
      .lean()

    return Response.json({ users }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching users:", error)
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    )
  }
}
