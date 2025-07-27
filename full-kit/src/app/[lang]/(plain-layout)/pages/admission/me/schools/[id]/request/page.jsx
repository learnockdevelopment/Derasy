"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { OAuthButtons } from "../../../../../../../../../components/auth/oauth2"
import { useUser } from "@/contexts/user-context"
import CardPreview from "./CardPreview"
import FormField from "./FormField"
import SubmitButton from "./SubmitButton"
import {
  promptEmail,
  promptOtp,
  showError,
  showLoading,
  showSuccess,
  showWarning,
} from "./alertService"
import {
  fetchSchoolData,
  quickRegister,
  submitCardRequest,
  verifyOtp,
} from "./apiService"
import { getTokenFromCookie, isUserEmpty, setTokenCookie } from "./authUtils"
import { type } from "os"

export default function StudentCardRequestForm() {
  const { id } = useParams()
  const [fields, setFields] = useState([])
  const [idCard, setIdCard] = useState([])
  const [templateImage, setTemplateImage] = useState("")
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")
  const user = useUser()

  useEffect(() => {
    if (!id) return
    loadSchoolData()
    getTokenFromCookie()
  }, [id])

  async function loadSchoolData() {
    try {
      const data = await fetchSchoolData(id)
      setIdCard(data.school?.idCard || [])
      setFields(data.school?.studentIdCardFields || [])
      setTemplateImage(data.school?.idCard.url || "")
    } catch (err) {
      showError("خطأ", "حدث خطأ أثناء تحميل بيانات المدرسة")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (isUserEmpty(user)) {
      showWarning("تنبيه", "يجب تسجيل الدخول أولاً لتقديم الطلب")
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      showLoading("جاري المعالجة", "جاري إرسال طلب البطاقة...")
      const token = getTokenFromCookie()
      setToken(token)
      await submitCardRequest(id, formData, token)
      showSuccess("تم الإرسال بنجاح", "تم إرسال طلب بطاقة الطالب.")
    } catch (err) {
      showError("خطأ", err.message)
    }
  }

  function validateForm() {
    for (const field of fields) {
      if (!formData[field.key]) {
        showWarning("تنبيه", `يرجى تعبئة حقل ${field.label || field.key}`)
        return false
      }
    }
    return true
  }

  async function handleEmailAuth() {
    const result = await promptEmail()
    if (!result.isConfirmed) return

    try {
      showLoading("جاري الإرسال", "جاري إرسال رمز التحقق...")
      await quickRegister(result.value)
      showSuccess("تم الإرسال", "تم إرسال رمز التحقق إلى بريدك الإلكتروني")
      await verifyOtpWithRetry(result.value)
      window.location.reload()
    } catch (err) {
      showError("خطأ", "حدث خطأ أثناء عملية التسجيل")
    }
  }

  async function verifyOtpWithRetry(email) {
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      attempts++
      const { value: otp, isDismissed } = await promptOtp(email, attempts, maxAttempts)
      if (isDismissed) return false

      try {
        showLoading("جاري التحقق", "جاري التحقق من رمز التحقق...")
        const data = await verifyOtp(email, otp)
        setTokenCookie(data.token)
        setToken(data.token)
        await showSuccess("تم التحقق بنجاح", data.message, 2000)
        return true
      } catch (err) {
        if (attempts >= maxAttempts) {
          showError("فشل التحقق", "لقد تجاوزت الحد الأقصى لمحاولات التحقق")
        }
      }
    }
    return false
  }

  if (loading) {
    return <p className="text-center mt-10">جاري تحميل البيانات...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 font-[Cairo]">
      <CardPreview
        idCard={idCard}
        templateImage={templateImage}
        fields={fields}
        formData={formData}
      />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
          <h2 className="text-xl font-bold text-center">طلب بطاقة طالب</h2>
        </div>

        <div className="p-6">
          {isUserEmpty(user) ? (
            <div className="space-y-6">
              <div className="text-center text-gray-700 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">لإكمال عملية الطلب، يرجى تسجيل الدخول أولاً</p>
                <p className="text-sm mt-2">سيتم حفظ بيانات الطلب بعد تسجيل الدخول</p>
              </div>

              
              
              <div className="grid grid-cols-1 gap-4">
                <OAuthButtons callbackUrl={`/pages/admission/me/schools/${id}/request`} />
                <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500">أو</span>
                </div>
              </div>
                <button
                  type="button"
                  onClick={handleEmailAuth}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  المتابعة بالبريد الإلكتروني
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                  field={{type: "text", key: "customId", label: "رقم الهوية المخصص"}}
                  value={formData["customId"]}
                  onChange={handleChange}
                />
              {fields.map((field, index) => (
                <FormField
                  key={index}
                  field={field}
                  value={formData[field.key]}
                  onChange={handleChange}
                />
              ))}
              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}