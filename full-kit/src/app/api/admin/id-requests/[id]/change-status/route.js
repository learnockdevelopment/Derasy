import { authenticate } from "@/middlewares/auth"
import StudentIdCardRequest from "@/models/StudentCard"
import { dbConnect } from "@/lib/dbConnect"

export async function PATCH(req, { params }) {
  try {
    await dbConnect()

    const user = await authenticate(req)
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { status } = body
    const { id: requestId } = params;
    if (!requestId || !status) {
      return Response.json({ message: "Missing requestId or status" }, { status: 400 })
    }

    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return Response.json({ message: "Invalid status" }, { status: 400 })
    }

    const updatedRequest = await StudentIdCardRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate("school")
      .populate("student")
      .lean()

    if (!updatedRequest) {
      return Response.json({ message: "Request not found" }, { status: 404 })
    }

    return Response.json({ message: "Status updated", request: updatedRequest }, { status: 200 })
  } catch (error) {
    console.error("❌ Error updating ID request status:", error)
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
