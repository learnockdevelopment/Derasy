import { authenticate } from "@/middlewares/auth";
import { dbConnect } from "@/lib/dbConnect";
import School from "@/models/School";
export async function PUT(req) {
  try {
    await dbConnect()

    const user = await authenticate(req)
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    if (!body || !body._id) {
      return Response.json({ message: "Missing school ID or request body" }, { status: 400 })
    }

    const updatedSchool = await School.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true,
    })

    if (!updatedSchool) {
      return Response.json({ message: "School not found" }, { status: 404 })
    }

    return Response.json({ message: "School updated", school: updatedSchool }, { status: 200 })
  } catch (error) {
    console.error("❌ Error updating school:", error)
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
