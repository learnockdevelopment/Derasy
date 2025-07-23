import { authenticate } from "@/middlewares/auth"
import StudentIdCardRequest from "@/models/StudentCard"
import { dbConnect } from "@/lib/dbConnect"

export async function PATCH(req, { params }) {
  try {
    await dbConnect()

    const user = await authenticate(req)

    const body = await req.json()
    const { status } = body
    const { id: requestId } = params

    if (!user || user.message) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    if (!requestId || !status) {
      return Response.json(
        { message: "Missing requestId or status" },
        { status: 400 }
      )
    }

    const validStatuses = ["pending", "approved", "rejected"]
    if (!validStatuses.includes(status)) {
      return Response.json({ message: "Invalid status" }, { status: 400 })
    }

    // First get the full request with the school (to check ownership)
    const existingRequest = await StudentIdCardRequest.findById(requestId)
      .populate({
        path: "school",
        populate: {
          path: "ownership",
          select: "owner",
        },
      })
      .lean()

    if (!existingRequest) {
      return Response.json({ message: "Request not found" }, { status: 404 })
    }

    // Check permissions
    const isAdmin = user.role === "admin"
    const isOwner =
      user.role === "school_owner" &&
      existingRequest.school?.ownership?.owner?.toString() === user.id.toString()

    if (!isAdmin && !isOwner) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Perform the update
    const updatedRequest = await StudentIdCardRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate("school")
      .populate("student")
      .lean()

    return Response.json(
      { message: "Status updated", request: updatedRequest },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error updating ID request status:", error)
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    )
  }
}
