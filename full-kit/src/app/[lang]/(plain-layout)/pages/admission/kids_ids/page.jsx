"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"
import NationalIdCardPreview from "./ChildCardPreview"
import FormContainer from "./FormContainer"
import StepperNavigation from "./StepperNavigation"
import useAuth from "./useAuth"
import useValidation from "./useValidation"

export default function ChildrenAddPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    nationality: "مصري",
    birthDate: "",
    birthPlace: "",
    nationalId: "",
    currentSchool: "",
    currentGrade: "",
    desiredGrade: "",
    ageInOctober: 0, // This will be calculated later
    religion: "",
    specialNeeds: { hasNeeds: false, description: "" },
    languagePreference: { primaryLanguage: "", secondaryLanguage: "" },
    healthStatus: { vaccinated: false, notes: "" },
    zone: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const governorates = [
    { value: "القاهرة", label: "القاهرة" },
    { value: "الإسكندرية", label: "الإسكندرية" },
    { value: "بورسعيد", label: "بورسعيد" },
    { value: "السويس", label: "السويس" },
    { value: "دمياط", label: "دمياط" },
    { value: "الدقهلية", label: "الدقهلية" },
    { value: "الشرقية", label: "الشرقية" },
    { value: "القليوبية", label: "القليوبية" },
    { value: "كفر الشيخ", label: "كفر الشيخ" },
    { value: "الغربية", label: "الغربية" },
    { value: "المنوفية", label: "المنوفية" },
    { value: "البحيرة", label: "البحيرة" },
    { value: "الإسماعيلية", label: "الإسماعيلية" },
    { value: "الجيزة", label: "الجيزة" },
  ]

  const steps = [
    {
      title: "نوع الطلب",
      fields: ["applicationType"],
    },
    {
      title: "نوع التعليم",
      fields: ["educationType"], // <-- New field here
    },
    {
      title: "معلومات الطالب الأساسية",
      fields: ["fullName", "gender", "birthDate", "nationalId"],
    },
    {
      title: "معلومات الطالب الدراسية",
      fields: ["currentSchool", "currentGrade", "desiredGrade"],
    },

    {
      title: "معلومات إضافية",
      fields: ["religion", "specialNeeds"]
    },
    {
      title: "الصحة والموقع",
      fields: ["languagePreference", "healthStatus", "zone"],
    },
  ];


  const { validateField, validateStep, debouncedExtractFromNationalId } =
    useValidation(setFormData, setErrors)
  const { showLoginPopup } = useAuth()

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    if (name === "nationalId") {
      setFormData((prev) => ({ ...prev, [name]: value }))
      debouncedExtractFromNationalId(value)
      return
    }

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]:
            type === "checkbox" || type === "radio"
              ? value === "true" || checked
              : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" || type === "radio"
            ? value === "true" || checked
            : value,
      }))
    }

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      nationalId: validateField("nationalId", formData.nationalId),
      gender: formData.gender ? "" : "الرجاء اختيار الجنس",
      birthDate: formData.birthDate ? "" : "الرجاء إدخال تاريخ الميلاد",
      desiredGrade: formData.desiredGrade ? "" : "الرجاء إدخال الصف المرغوب",
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some((error) => error)) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء تصحيح الحقول المطلوبة.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || null

      toast({
        title: "جاري حفظ البيانات...",
        description: "نقوم الآن بمعالجة طلبك.",
      })

      const res = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.status === 403) {
        showLoginPopup(async () => {
          // Retry submission after successful login
          handleSubmit(e)
        })
        return
      }

      if (res.ok) {
        toast({
          title: "تم التسجيل بنجاح",
          description: `تم تسجيل الطفل ${formData.fullName} بنجاح.`,
        })

        setFormData({
          fullName: "",
          gender: "",
          birthDate: "",
          nationalId: "",
          currentSchool: "",
          currentGrade: "",
          desiredGrade: "",
          religion: "",
          specialNeeds: { hasNeeds: false, description: "" },
          languagePreference: { primaryLanguage: "", secondaryLanguage: "" },
          healthStatus: { vaccinated: false, notes: "" },
          zone: "",
        })
        setErrors({})
        setCurrentStep(1)
      } else {
        toast({
          title: "خطأ",
          description: data.message || "حدث خطأ أثناء الحفظ.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "تعذر الاتصال بالخادم.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    const stepErrors = validateStep(steps[currentStep - 1].fields, formData)
    setErrors((prev) => ({ ...prev, ...stepErrors }))

    if (Object.values(stepErrors).some((error) => error)) {
      toast({
        title: "خطأ في هذه الخطوة",
        description: "يرجى إكمال الحقول المطلوبة قبل المتابعة.",
        variant: "destructive",
      })
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep )
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="py-16 ">
      <div className="mx-auto max-w-3xl px-6 flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="flex-1 bg-white rounded shadow-md p-6">
          <h1 className="text-3xl font-bold mb-8 text-center">
            إضافة بيانات الطفل
          </h1>
          <StepperNavigation
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          <FormContainer
            currentStep={currentStep}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            governorates={governorates}
            steps={steps}
          />
        </div>

        {/* Preview Card */}
        {/* <div className="w-full md:w-1/3 sticky top-20 h-fit">
          <NationalIdCardPreview formData={formData} />
        </div> */}
      </div>
    </div>
  )
}
