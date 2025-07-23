import { NextResponse } from "next/server"
import { authenticate } from "@/middlewares/auth"
import School from "@/models/School"

import { dbConnect } from "@/lib/dbConnect"

// GET single school
export async function GET(req, { params }) {
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
      .populate("ownership.owner", "fullName email")
      .populate("ownership.moderators", "fullName email")
      .lean()

    if (!school) {
      return NextResponse.json({ message: "School not found" }, { status: 404 })
    }

    return NextResponse.json({ school })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}

// PUT to update idCardFields
export async function PUT(req, { params }) {
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

    const body = await req.json()
    const { studentIdCardFields } = body
    const idCardFields = studentIdCardFields || []

    if (!Array.isArray(idCardFields)) {
      return NextResponse.json(
        { message: "idCardFields must be an array" },
        { status: 400 }
      )
    }

    const school = await School.findById(id)
    if (!school) {
      return NextResponse.json({ message: "School not found" }, { status: 404 })
    }

    // Get current card dimensions (fallback if undefined)
    const cardWidth = school.idCard?.width || 600
    const cardHeight = school.idCard?.height || 400

    // Inject percentage values into each style object
    const updatedFields = idCardFields.map((field) => {
      const style = field.style || {}
      const x = style.x || 0
      const y = style.y || 0

      return {
        ...field,
        style: {
          ...style,
          xPercentage: parseFloat(((x / cardWidth) * 100).toFixed(2)),
          yPercentage: parseFloat(((y / cardHeight) * 100).toFixed(2)),
        },
      }
    })

    // Save updated fields
    school.studentIdCardFields = updatedFields
    await school.save()

    return NextResponse.json({ message: "Fields updated successfully", school })
  } catch (error) {
    console.error("Error updating school:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}
