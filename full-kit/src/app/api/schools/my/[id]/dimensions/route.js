import { NextResponse } from "next/server"
import { authenticate } from "@/middlewares/auth"
import School from "@/models/School"

import { dbConnect } from "@/lib/dbConnect"

// Update ID Card dimensions
export async function POST(req, { params }) {
  try {
    await dbConnect()
    const user = await authenticate(req)
    if (!user || user.message) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = params
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid school ID" },
        { status: 400 }
      )
    }

    const school = await School.findById(id)
    if (!school) {
      return NextResponse.json({ message: "School not found" }, { status: 404 })
    }

    const body = await req.json()
    console.log(body)
    // Expected fields: width, height, top, left, fontSize, etc.
    const { width, height, aspectRatio } = body

    // Update only the fields that were sent
    school.idCard.width = width || school.idCard.width
    school.idCard.height = height || school.idCard.height
    school.idCard.aspectRatio = aspectRatio || school.idCard.aspectRatio

    await school.save()

    return NextResponse.json({
      message: "Card dimensions updated successfully",
      dimensions: school.idCard.dimensions,
    })
  } catch (error) {
    console.error("❌ Update error:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}
