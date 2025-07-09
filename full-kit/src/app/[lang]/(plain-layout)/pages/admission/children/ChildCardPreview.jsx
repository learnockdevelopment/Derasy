export default function NationalIdCardPreview({ formData }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4 w-full max-w-sm space-y-4 text-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-2">بطاقة الطفل</h2>

      <div className="space-y-2">
        <PreviewItem label="الاسم الكامل" value={formData.fullName} />
        <PreviewItem
          label="الجنس"
          value={
            formData.gender === 'male'
              ? 'ذكر'
              : formData.gender === 'female'
              ? 'أنثى'
              : ''
          }
        />
        <PreviewItem label="تاريخ الميلاد" value={formData.birthDate} />
        <PreviewItem label="الرقم القومي" value={formData.nationalId} />
        <PreviewItem label="المدرسة الحالية" value={formData.currentSchool} />
        <PreviewItem label="الصف الحالي" value={formData.currentGrade} />
        <PreviewItem label="الصف المرغوب" value={formData.desiredGrade} />
        <PreviewItem label="الديانة" value={formData.religion} />
        <PreviewItem
          label="ذوي الاحتياجات الخاصة"
          value={formData.specialNeeds?.hasNeeds ? 'نعم' : 'لا'}
        />
        {formData.specialNeeds?.hasNeeds && (
          <PreviewItem label="تفاصيل الاحتياجات" value={formData.specialNeeds.description} />
        )}
        <PreviewItem
          label="اللغة الأساسية"
          value={formData.languagePreference?.primaryLanguage}
        />
        <PreviewItem
          label="اللغة الثانوية"
          value={formData.languagePreference?.secondaryLanguage}
        />
        <PreviewItem
          label="الحالة الصحية"
          value={formData.healthStatus?.vaccinated ? 'محصن' : 'غير محصن'}
        />
        {formData.healthStatus?.notes && (
          <PreviewItem label="ملاحظات صحية" value={formData.healthStatus.notes} />
        )}
        <PreviewItem label="الموقع / المنطقة" value={formData.zone} />
      </div>
    </div>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div>
      <span className="font-semibold text-gray-600">{label}:</span>
      <p className="text-gray-800">{value || '---'}</p>
    </div>
  );
}
