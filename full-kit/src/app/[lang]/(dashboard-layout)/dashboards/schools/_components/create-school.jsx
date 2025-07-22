"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function SchoolCreateModal({ open, onOpenChange, formData, setFormData, handleSubmit, loading }) {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const totalSteps = 6

  const stepFields = [
    <>
      <Input placeholder="اسم المدرسة" value={formData.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
      <Input placeholder="نوع المدرسة (مثل: International)" value={formData.type || ""} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} />
      <Input placeholder="رابط الموقع الإلكتروني" value={formData.website || ""} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} />
    </>,
    <>
      <Input placeholder="رابط الشعار Logo URL" value={formData.logoUrl || ""} onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))} />
      <Input placeholder="الديانة (Muslim/Christian/Mixed/Other)" value={formData.religionType || ""} onChange={(e) => setFormData(prev => ({ ...prev, religionType: e.target.value }))} />
      <Input placeholder="اللغات (مثال: Arabic,English)" value={formData.languages?.join(",") || ""} onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value.split(",") }))} />
    </>,
    <>
      <Input placeholder="المراحل الدراسية (مثال: KG1,Primary1)" value={formData.gradesOffered?.join(",") || ""} onChange={(e) => setFormData(prev => ({ ...prev, gradesOffered: e.target.value.split(",") }))} />
      <Input placeholder="سن القبول KG1" type="number" value={formData.ageRequirement?.KG1 || ""} onChange={(e) => setFormData(prev => ({ ...prev, ageRequirement: { ...prev.ageRequirement, KG1: e.target.value } }))} />
      <Input placeholder="سن القبول KG2" type="number" value={formData.ageRequirement?.KG2 || ""} onChange={(e) => setFormData(prev => ({ ...prev, ageRequirement: { ...prev.ageRequirement, KG2: e.target.value } }))} />
    </>,
    <>
      <Input placeholder="سن القبول Primary1" type="number" value={formData.ageRequirement?.Primary1 || ""} onChange={(e) => setFormData(prev => ({ ...prev, ageRequirement: { ...prev.ageRequirement, Primary1: e.target.value } }))} />
      <Textarea placeholder="المستندات المطلوبة (مثل: Birth Certificate,Vaccination Card)" value={formData.documentsRequired?.join(",") || ""} onChange={(e) => setFormData(prev => ({ ...prev, documentsRequired: e.target.value.split(",") }))} />
      <Input placeholder="أقل قيمة للمصاريف" type="number" value={formData.feesRange?.min || ""} onChange={(e) => setFormData(prev => ({ ...prev, feesRange: { ...prev.feesRange, min: e.target.value } }))} />
    </>,
    <>
      <Input placeholder="أقصى قيمة للمصاريف" type="number" value={formData.feesRange?.max || ""} onChange={(e) => setFormData(prev => ({ ...prev, feesRange: { ...prev.feesRange, max: e.target.value } }))} />
      <Input placeholder="قيمة رسوم التقديم" type="number" value={formData.admissionFee?.amount || ""} onChange={(e) => setFormData(prev => ({ ...prev, admissionFee: { ...prev.admissionFee, amount: e.target.value } }))} />
      <Input placeholder="عملة رسوم التقديم" value={formData.admissionFee?.currency || ""} onChange={(e) => setFormData(prev => ({ ...prev, admissionFee: { ...prev.admissionFee, currency: e.target.value } }))} />
    </>,
    <>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={formData.admissionFee?.isRefundable || false} onChange={(e) => setFormData(prev => ({ ...prev, admissionFee: { ...prev.admissionFee, isRefundable: e.target.checked } }))} />
        <span className="ml-2">الرسوم قابلة للاسترداد</span>
      </label>

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={formData.supportsSpecialNeeds || false} onChange={(e) => setFormData(prev => ({ ...prev, supportsSpecialNeeds: e.target.checked }))} />
        <span className="ml-2">يدعم الاحتياجات الخاصة</span>
      </label>

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={formData.isReligious || false} onChange={(e) => setFormData(prev => ({ ...prev, isReligious: e.target.checked }))} />
        <span className="ml-2">مدرسة دينية</span>
      </label>

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={formData.admissionOpen || false} onChange={(e) => setFormData(prev => ({ ...prev, admissionOpen: e.target.checked }))} />
        <span className="ml-2">باب التقديم مفتوح</span>
      </label>
    </>
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="mb-2">➕ إضافة مدرسة</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مدرسة جديدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          {stepFields[step - 1]}

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              السابق
            </Button>
            {step === totalSteps ? (
              <Button disabled={loading} onClick={handleSubmit}>
                {loading ? "جاري الإرسال..." : "إنشاء"}
              </Button>
            ) : (
              <Button onClick={nextStep}>التالي</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
