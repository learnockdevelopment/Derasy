"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { Download, IdCard, Filter, X } from "lucide-react"

import { useUser } from "@/contexts/user-context"
import BrandingBanner from "../../../../../../../components/branding-banner"

export default function StudentCardRequestsPage() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [templateImage, setTemplateImage] = useState("")
  const [fieldsConfig, setFieldsConfig] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [schoolFilter, setSchoolFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
        const token = match ? match[1] : null

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [reqRes] = await Promise.all([
          fetch(`/api/schools/my/cards`, { headers }),
        ])

        const reqData = await reqRes.json()
        console.log("reqData", reqData)
        if (!reqRes.ok) throw new Error(reqData.message)

        setRequests(reqData.requests || [])
        setFilteredRequests(reqData.requests || [])
        setFieldsConfig(reqData.fields || [])
        setTemplateImage(reqData?.school?.idCard?.url || "")
      } catch (err) {
        Swal.fire({ icon: "error", title: "خطأ", text: err.message })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [statusFilter, schoolFilter, searchQuery, requests])

  const applyFilters = () => {
    let result = [...requests]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(req => req.status === statusFilter)
    }

    // Apply school filter
    if (schoolFilter !== "all") {
      result = result.filter(req => req.school._id === schoolFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(req => 
        req.student.name.toLowerCase().includes(query) ||
        req.school.name.toLowerCase().includes(query) ||
        req._id.toLowerCase().includes(query)
      )
    }

    setFilteredRequests(result)
  }

  const resetFilters = () => {
    setStatusFilter("all")
    setSchoolFilter("all")
    setSearchQuery("")
    setFilteredRequests(requests)
  }

  // Calculate statistics
  const stats = {
    total: requests.length,
    approved: requests.filter(req => req.status === "approved").length,
    pending: requests.filter(req => req.status === "pending").length,
    rejected: requests.filter(req => req.status === "rejected").length,
    schools: [...new Set(requests.map(req => req.school._id))].length
  }

  // Get unique schools for filter dropdown
  const uniqueSchools = [...new Set(requests.map(req => req.school))]

  if (loading) return <p className="text-center mt-10">جاري تحميل الطلبات...</p>

  return (
    <div className="container mx-auto p-6 font-[Cairo]">
      {/* 🌟 Branding Slogan Banner */}
      <BrandingBanner
        user={user}
        content={
          "من خلال منصتنا، يمكن للطلاب طلب كارنيهاتهم إلكترونيًا، ويقوم مدير المدرسة بمراجعتها والموافقة عليها بضغطة زر"
        }
        pageTitle={"طلبات الكارنيهات"}
        actionButton={
          <button
            className="flex items-center gap-2 border border-purple-600 text-purple-700 hover:bg-purple-50 px-5 py-2 text-sm rounded transition"
            onClick={() => {
              router.push("/pages/admission/me/schools")
            }}
          >
            <IdCard className="w-4 h-4" />
            تعديل حقول بطاقة الطالب
          </button>
        }
      />

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">إجمالي الطلبات</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-100">
          <h3 className="text-gray-500 text-sm font-medium">مقبولة</h3>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-yellow-100">
          <h3 className="text-gray-500 text-sm font-medium">قيد الانتظار</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
          <h3 className="text-gray-500 text-sm font-medium">مرفوضة</h3>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* 🔍 Filters Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث عن طالب أو مدرسة..."
              className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>تصفية النتائج</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="approved">مقبولة</option>
                  <option value="rejected">مرفوضة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                >
                  <option value="all">الكل</option>
                  {uniqueSchools.map((school) => (
                    <option key={school._id} value={school._id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📝 Results Info */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          عرض <span className="font-bold">{filteredRequests.length}</span> من أصل <span className="font-bold">{requests.length}</span> طلب
        </p>
        {filteredRequests.length === 0 && requests.length > 0 && (
          <button
            onClick={resetFilters}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
          >
            <X size={14} className="ml-1" />
            مسح جميع الفلاتر
          </button>
        )}
      </div>

      {/* 🟢 عرض الطلبات */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">
            {requests.length === 0 ? "لا توجد طلبات حالياً" : "لا توجد نتائج مطابقة للبحث"}
          </p>
          {requests.length > 0 && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              عرض جميع الطلبات
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((req, idx) => (
            <Link
              href={`/pages/admission/me/schools/${req.school._id}/requests/${req._id}`}
              key={idx}
              className="block shadow  rounded-3xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <div className="bg-gray-200 shadow rounded-3xl p-4 hover:shadow-lg transition">
                <div className="relative w-full h-[250px] border rounded-3xl overflow-hidden mb-4 ">
                  {req.school.idCard.url ? (
                    <Image
                      src={req.school.idCard.url || templateImage}
                      alt="بطاقة"
                      layout="fill"
                      objectFit="cover"
                      className="z-0 "
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

                <div className="mt-4">
                  {/* School name and status badge */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 truncate max-w-[70%]">
                      {req.school.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-4 shadow-sm bg-violet-100 text-violet-800 
        ${
          req.status === "approved"
            ? "bg-green-50 text-green-800 ring-1 ring-green-100"
            : req.status === "rejected"
              ? "bg-red-50 text-red-800 ring-1 ring-red-100"
              : "bg-gray-50 text-gray-800 ring-1 ring-gray-200"
        }`}
                    >
                      {req.status === "approved" ? (
                        <>
                          <svg
                            className="w-3 h-3 mr-1.5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          تم القبول
                        </>
                      ) : req.status === "rejected" ? (
                        <>
                          <svg
                            className="w-3 h-3 mr-1.5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          مرفوض
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3 mr-1.5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          قيد المراجعة
                        </>
                      )}
                    </span>
                  </div>

                  {/* Student and date info */}
                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mt-0.5 mx-2 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          مقدم الطلب:{" "}
                        </span>
                        <span className="text-gray-800">
                          {req.student.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mt-0.5 mx-2 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          تاريخ الطلب:{" "}
                        </span>
                        <span className="text-gray-800">
                          {new Date(req.createdAt).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-around gap-3 mt-6">
                      <button
                        className="px-4 py-2 w-full text-slate-900 border-1 border-[#949494] rounded-xl duration-300
text-base
font-bold
font-['Cairo']  hover:bg-[#471396] hover:text-white"
                      >
                        معاينة البيانات
                      </button>
                      <button
                        className="px-4 py-2 w-full text-white
text-base
font-bold
font-['Cairo'] bg-[#471396] rounded-xl hover:bg-white hover:text-[#471396] border-1 border-[#471396] duration-300"
                      >
                        جاهز للطباعة
                      </button>
                      <div>
                        <Download />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}