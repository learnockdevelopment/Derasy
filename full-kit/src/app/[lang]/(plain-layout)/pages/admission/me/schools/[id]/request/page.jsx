"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

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
  }, [id])

  async function loadSchoolData() {
    try {
      const data = await fetchSchoolData(id)
      setIdCard(data.school?.idCard || [])
      setFields(data.school?.studentIdCardFields || [])
      setTemplateImage(data.school?.idCard.url || "")
    } catch (err) {
      showError("خطأ", err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log("🟡 Form submission started")

    if (isUserEmpty(user)) {
      console.log("🔴 No user found – calling handleUnregisteredUser()")
      await handleUnregisteredUser()
      return
    }

    console.log("✅ User is valid:", user)

    if (!validateForm()) {
      console.log("🔴 Form validation failed")
      return
    }
    console.log("✅ Form validated successfully")

    try {
      const token = getTokenFromCookie()
      console.log("🔑 Retrieved token from cookie:", token)
      setToken(token)

      showLoading()
      console.log("⏳ Showing loading indicator")

      await submitCardRequest(id, formData, token)
      console.log("✅ Card request submitted successfully")

      showSuccess("تم الإرسال بنجاح", "تم إرسال طلب بطاقة الطالب.")
      console.log("🎉 Success message displayed")
    } catch (err) {
      console.error("❌ Error during card request submission:", err)
      showError("خطأ", err.message)
    }
  }

  function validateForm() {
    for (const field of fields) {
      if (!formData[field.key]) {
        showWarning("تنبيه", `يرجى تعبئة ${field.key}`)
        return false
      }
    }
    return true
  }

  async function handleUnregisteredUser() {
    console.log("🟡 Unregistered user flow started")

    const result = await promptEmail()
    console.log("📨 Email prompt result:", result)

    if (!result.isConfirmed) {
      console.log("❌ User cancelled email prompt")
      return
    }

    try {
      console.log("⏳ Showing loading: sending verification code...")
      showLoading("جاري الإرسال", "جاري إرسال رمز التحقق...")

      console.log("📤 Sending quick register request for:", result.value)
      await quickRegister(result.value)
      console.log("✅ Quick register request sent")

      showSuccess("تم الإرسال", "تم إرسال الطلب بنجاح.")
      console.log("🎉 Success message displayed for quick register")

      console.log("🔐 Verifying OTP with retry for:", result.value)
      await verifyOtpWithRetry(result.value)
      console.log("✅ OTP verified successfully")

      console.log("📨 Submitting card request after registration")
      await submitCardRequest(id, formData, token)
      console.log("✅ Card request submitted successfully (after registration)")

      console.log("🔄 Reloading the page")
      window.location.reload()
    } catch (err) {
      console.error("❌ Error in unregistered user flow:", err)
      showError("خطأ", err.message)
    }
  }

  async function verifyOtpWithRetry(email) {
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      attempts++
      const { value: otp, isDismissed } = await promptOtp(
        email,
        attempts,
        maxAttempts
      )
      if (isDismissed) return false

      try {
        showLoading("جاري التحقق", "جاري التحقق من رمز التحقق...")
        const data = await verifyOtp(email, otp)
        setTokenCookie(data.token)
        setToken(data.token)
        if (data.correct) {
          await submitCardRequest(id, formData, token)
        }
        await showSuccess("تم التحقق بنجاح", data.message, 2000)
        return true
      } catch (err) {
        if (attempts >= maxAttempts) {
          showError("فشل التحقق", "لقد تجاوزت الحد الأقصى لمحاولات التحقق.")
          return false
        }
      }
    }
    return false
  }

  if (loading)
    return <p className="text-center mt-10">جاري تحميل البيانات...</p>

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 font-[Cairo]">
      <CardPreview
        idCard={idCard}
        templateImage={templateImage}
        fields={fields}
        formData={formData}
      />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
          <h2 className="text-xl font-bold text-center">طلب بطاقة طالب</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
      </div>
    </div>
  )
}
