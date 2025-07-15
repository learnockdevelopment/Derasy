"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Swal from "sweetalert2"
import { Loader2 } from "lucide-react"

export default function TransactionInvoicePage() {
  const { id } = useParams()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1] || ""

        const res = await fetch(`/api/me/wallet/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || "فشل تحميل المعاملة")

        setTransaction(data.transaction)
      } catch (error) {
        Swal.fire({ icon: "error", title: "خطأ", text: error.message })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTransaction()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-purple-600" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        لم يتم العثور على المعاملة.
      </div>
    )
  }

  const {
    title = "معاملة بدون عنوان",
    description,
    amount,
    type,
    createdAt,
    _id,
    status = "completed",
  } = transaction

  const isIncome = ["deposit", "refund", "hold_income"].includes(type)

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 font-[Cairo] text-right border">
      <h2 className="text-xl font-bold mb-2 text-purple-700">
        🧾 تفاصيل المعاملة
      </h2>
      <p className="text-sm text-gray-500 mb-6">رقم المعاملة: {_id}</p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">العنوان:</span>
          <span className="font-medium text-gray-800">{title}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">الوصف:</span>
          <span className="text-gray-800">{description || "—"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">النوع:</span>
          <span className={isIncome ? "text-green-600" : "text-red-600"}>
            {isIncome ? "إيداع" : "سحب"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">المبلغ:</span>
          <span className="font-bold text-lg">
            {isIncome ? "+" : "-"}
            {amount.toLocaleString("ar-EG")} جنيه
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">الحالة:</span>
          <span className="text-blue-600">
            {status === "pending" ? "معلقة" : "منتهية"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">تاريخ المعاملة:</span>
          <span className="text-gray-800">
            {new Date(createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
        شكراً لاستخدامك محفظة مدرستنا
      </div>
    </div>
  )
}
