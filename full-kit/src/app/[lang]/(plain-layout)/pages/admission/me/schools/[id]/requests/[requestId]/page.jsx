"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import Swal from "sweetalert2"
import { ClipboardList } from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/user-context"

export default function StudentCardViewPage() {
  const { id, requestId } = useParams()
  const [request, setRequest] = useState(null)
  const [templateImage, setTemplateImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingStatusId, setLoadingStatusId] = useState(null)

  const user = useUser()
  async function fetchRequest() {
    try {
      const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
      const token = match ? match[1] : null

      const res = await fetch(
        `/api/schools/my/${id}/card/request/${requestId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      )
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setRequest(data.request)
      setTemplateImage(data?.request?.school?.idCard?.url || "")
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطأ", text: err.message })
    } finally {
      setLoading(false)
    }
  }
  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }
  const handleCopy = () => {
    const currentUrl = window.location.href

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast({
          title: "نجاح",
          description: "تم نسخ الرابط بنجاح.",
          variant: "success",
        })
      })
      .catch(() => {
        toast({
          title: "خطأ",
          description: "فشل في نسخ الرابط.",
          variant: "destructive",
        })
      })
  }
  const updateStatus = async (id, status) => {
    setLoadingStatusId(id) // Start loading

    try {
      const token = getCookie("token")
      const response = await fetch(
        `/api/admin/id-requests/${id}/change-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        throw new Error("فشل في تحديث الحالة")
      }

      fetchRequest()

      toast({
        title: "نجاح",
        description: `تم تحديث حالة الطلب إلى ${status}.`,
      })
    } catch (err) {
      console.error("❌ Error updating status:", err)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة.",
        variant: "destructive",
      })
    } finally {
      setLoadingStatusId(null) // End loading
    }
  }

  useEffect(() => {
    if (!id || !requestId) return

    fetchRequest()
  }, [id, requestId])

  function getPercentageStyle(style = {}, realWidth = 350, realHeight = 220) {
    return {
      position: "absolute",
      left: `${((style.x || 0) / realWidth) * 100}%`,
      top: `${((style.y || 0) / realHeight) * 100}%`,
      width: `${((style.width || 100) / realWidth) * 100}%`,
      height: `${((style.height || 30) / realHeight) * 100}%`,
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
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) return <p className="text-center mt-10">جاري تحميل البطاقة...</p>
  if (!request)
    return (
      <p className="text-center mt-10 text-gray-600">لم يتم العثور على الطلب</p>
    )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Card Preview Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">معاينة البطاقة</h2>
        <div className="relative w-full h-[350px] border rounded overflow-hidden mb-4">
          {request.school.idCard.url ? (
            <Image
              src={request.school.idCard.url || templateImage}
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

          {request.school.studentIdCardFields.map((field, i) => {
            const style = field.style || {}
            const submittedValue = request.fields?.find(
              (f) => f.key === field.key
            )?.value

            const commonStyle = getPercentageStyle(style)

            if (field.type === "photo" && submittedValue?.startsWith("http")) {
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
        <div>
          {user && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition flex gap-2"
              >
                نسخ رابط طلب البطاقة <ClipboardList />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between items-center mt-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {request.school.name}
            </h3>
            <p className="text-sm text-gray-600">مدرسة {request.school.type}</p>
          </div>
          {user.role === "school_owner" ? (
            <div className="relative inline-block">
              <select
                value={request.status}
                onChange={(e) => updateStatus(request._id, e.target.value)}
                disabled={loadingStatusId === request._id}
                className={`appearance-none inline-flex items-center pl-4 pr-8 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2
      ${
        request.status === "approved"
          ? "bg-green-50 text-green-800 hover:bg-green-100 focus:ring-green-200"
          : request.status === "rejected"
            ? "bg-red-50 text-red-800 hover:bg-red-100 focus:ring-red-200"
            : "bg-gray-50 text-gray-800 hover:bg-gray-100 focus:ring-gray-200"
      }
      ${loadingStatusId === request._id ? "opacity-70 cursor-not-allowed" : ""}
    `}
              >
                <option value="pending" className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  قيد المراجعة
                </option>
                <option value="approved" className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  تم القبول
                </option>
                <option value="rejected" className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  مرفوض
                </option>
              </select>

              {/* Custom dropdown arrow */}
              <div
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none
    ${loadingStatusId === request._id ? "opacity-50" : ""}
  `}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Loading indicator */}
              {loadingStatusId === request._id && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <span
              className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold
      ${
        request.status === "approved"
          ? "bg-green-100 text-green-800"
          : request.status === "rejected"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
      }`}
            >
              {request.status === "approved"
                ? "تم القبول"
                : request.status === "rejected"
                  ? "مرفوض"
                  : "قيد المراجعة"}
            </span>
          )}
        </div>
      </div>

      {/* Request Details Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الطلب</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              معلومات الطالب
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="text-gray-800 font-medium">
                  {request.student.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="text-gray-800 font-medium">
                  {request.student.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="text-gray-800 font-medium">
                  {formatDate(request.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">آخر تحديث:</span>
                <span className="text-gray-800 font-medium">
                  {formatDate(request.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              معلومات المدرسة
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="text-gray-800 font-medium">
                  {request.school.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الموقع الإلكتروني:</span>
                <a
                  href={request.school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {request.school.website}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">رسوم التسجيل:</span>
                <span className="text-gray-800 font-medium">
                  {request.school.admissionFee.amount}{" "}
                  {request.school.admissionFee.currency}
                  {request.school.admissionFee.isRefundable
                    ? " (قابلة للاسترداد)"
                    : " (غير قابلة للاسترداد)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نطاق المصروفات:</span>
                <span className="text-gray-800 font-medium">
                  {request.school.feesRange.min} -{" "}
                  {request.school.feesRange.max}{" "}
                  {request.school.admissionFee.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch Information */}
        {/* <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">معلومات الفرع</h3>
          {request.school.branches.map((branch, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="text-gray-800 font-medium">{branch.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المحافظة:</span>
                <span className="text-gray-800 font-medium">{branch.governorate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المنطقة:</span>
                <span className="text-gray-800 font-medium">{branch.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العنوان:</span>
                <span className="text-gray-800 font-medium">{branch.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الهاتف:</span>
                <span className="text-gray-800 font-medium">{branch.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="text-gray-800 font-medium">{branch.contactEmail}</span>
              </div>
            </div>
          ))}
        </div> */}

        {/* School Details */}
        {/* <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">تفاصيل إضافية</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المراحل المتاحة:</span>
              <span className="text-gray-800 font-medium">{request.school.gradesOffered.join('، ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">اللغات:</span>
              <span className="text-gray-800 font-medium">{request.school.languages.join('، ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">مدرسة دينية:</span>
              <span className="text-gray-800 font-medium">
                {request.school.isReligious ? `نعم (${request.school.religionType})` : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">يدعم ذوي الاحتياجات الخاصة:</span>
              <span className="text-gray-800 font-medium">
                {request.school.supportsSpecialNeeds ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">التسجيل مفتوح:</span>
              <span className="text-gray-800 font-medium">
                {request.school.admissionOpen ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المستندات المطلوبة:</span>
              <span className="text-gray-800 font-medium">
                {request.school.documentsRequired.join('، ')}
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Submitted Fields */}
      {request.fields && request.fields.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            الحقول المقدمة
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحقل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القيمة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {request.fields.map((field, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.value || "---"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
