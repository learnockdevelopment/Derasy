"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import Swal from "sweetalert2"

export default function StudentCardRequestsPage() {
  const { id } = useParams() // School ID
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [templateImage, setTemplateImage] = useState("")
  const [fieldsConfig, setFieldsConfig] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all") // 🔵 فلتر الحالة

  useEffect(() => {
    if (!id) return

    async function fetchData() {
      try {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
        const token = match ? match[1] : null
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [reqRes, summaryRes] = await Promise.all([
          fetch(`/api/schools/my/${id}/card/request`, { headers }),
          fetch(`/api/schools/my/${id}/card/request/summary`, { headers }),
        ])

        const reqData = await reqRes.json()
        const summaryData = await summaryRes.json()

        if (!reqRes.ok) throw new Error(reqData.message)
        if (!summaryRes.ok) throw new Error(summaryData.message)

        setRequests(reqData.requests || [])
        setFilteredRequests(reqData.requests || [])
        setFieldsConfig(reqData.fields || [])
        setTemplateImage(reqData?.school?.idCard?.url || "")
        setSummary(summaryData.summary)
      } catch (err) {
        Swal.fire({ icon: "error", title: "خطأ", text: err.message })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // 🔵 تصفية الطلبات حسب الحالة
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter((r) => r.status === statusFilter))
    }
  }, [statusFilter, requests])

  if (loading) return <p className="text-center mt-10">جاري تحميل الطلبات...</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* 🟢 قسم الإحصائيات */}
      {summary && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">إجمالي الطلبات</p>
            <h3 className="text-2xl font-bold">{summary.total}</h3>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">الحالة</p>
            {summary.statusStats.map((s, i) => (
              <div key={i} className="text-sm text-gray-700">
                {s._id || "غير محدد"}: {s.count}
              </div>
            ))}
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">آخر 7 أيام</p>
            {summary.dailyStats.map((d, i) => (
              <div key={i} className="text-sm text-gray-700">
                {d._id}: {d.count}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔵 شريط الفلترة */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-semibold">تصفية حسب الحالة:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="all">الكل</option>
          <option value="approved">تم القبول</option>
          <option value="rejected">مرفوض</option>
          <option value="pending">قيد المراجعة</option>
        </select>
      </div>

      {/* 🟢 عرض الطلبات */}
      {filteredRequests.length === 0 ? (
        <p className="text-center text-gray-600">لا توجد طلبات لهذه الحالة</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((req, idx) => (
            <Link
              href={`/pages/admission/me/schools/${req.school._id}/requests/${req._id}`}
              key={idx}
              className="block"
            >
              <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
                <div className="relative w-full h-[250px] border rounded overflow-hidden mb-4">
                  {req.school.idCard.url ? (
                    <Image
                      src={req.school.idCard.url || templateImage}
                      alt="بطاقة"
                      layout="fill"
                      objectFit="cover"
                      className="z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                      لا يوجد قالب
                    </div>
                  )}

                  {req.school.studentIdCardFields.map((field, i) => {
                    const style = field.style || {}
                    const submittedValue = req.fields?.find(
                      (f) => f.key === field.key
                    )?.value

                    const commonStyle = {
                      position: "absolute",
                      left: `${style.x || 0}px`,
                      top: `${style.y || 0}px`,
                      width: `${style.width || 100}px`,
                      height: `${style.height || 30}px`,
                      fontSize: `${style.fontSize || 14}px`,
                      fontWeight: style.fontWeight || "normal",
                      color: style.color || "#000",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      textAlign: style.textAlign || "center",
                      backgroundColor: "transparent",
                      padding: "2px",
                      borderRadius: "4px",
                      zIndex: 10,
                      pointerEvents: "none",
                    }

                    if (
                      field.type === "photo" &&
                      submittedValue?.startsWith("http")
                    ) {
                      return (
                        <img
                          key={i}
                          src={submittedValue}
                          alt={field.key}
                          style={{
                            ...commonStyle,
                            objectFit: "cover",
                            border: "1px solid #ccc",
                          }}
                        />
                      )
                    }

                    return (
                      <div key={i} style={commonStyle}>
                        {submittedValue || "---"}
                      </div>
                    )
                  })}
                </div>

                <div className="text-center mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                      ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {req.status === "approved"
                      ? "تم القبول"
                      : req.status === "rejected"
                      ? "مرفوض"
                      : "قيد المراجعة"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
