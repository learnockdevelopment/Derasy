import { authenticate } from "@/middlewares/auth"
import Transaction from "@/models/Transaction"

import { dbConnect } from "@/lib/dbConnect"

export async function GET(req, context) {
  try {
    await dbConnect()

    const user = await authenticate(req)
    if (!user || user.message) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }
    const id = context.params?.id // ✅ safer
    const transaction = await Transaction.findOne({
      _id: id,
      user: user.id,
    })

    if (!transaction) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 }
      )
    }

    // ❌ Block if it's hold_income and owned by this user
    if (
      transaction.type === "hold_income" &&
      transaction.user.equals(user.id)
    ) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 }
      )
    }

    return Response.json({ transaction })
  } catch (error) {
    console.error("❌ Error fetching transaction:", error)
    return Response.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
