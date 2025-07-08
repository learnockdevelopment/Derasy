import Select from "react-select";

export default function HealthAndLocationStep({ formData, setFormData, handleChange, governorates }) {
  return (
    <>
      {/* Language Preference */}
      <div>
        <label className="block font-semibold mb-1">اللغة الأساسية</label>
        <select
          name="languagePreference.primaryLanguage"
          value={formData.languagePreference.primaryLanguage}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          aria-describedby="primaryLanguageHelp"
        >
          <option value="">اختر اللغة</option>
          <option value="Arabic">العربية</option>
          <option value="English">الإنجليزية</option>
          <option value="French">الفرنسية</option>
          <option value="German">الألمانية</option>
          <option value="Other">أخرى</option>
        </select>
        <p id="primaryLanguageHelp" className="text-sm text-gray-500 mt-1">
          اختر اللغة الأساسية لتعليم الطفل
        </p>
      </div>

      <div>
        <label
          htmlFor="languagePreference.secondaryLanguage"
          className="block font-semibold mb-1"
        >
          اللغة الثانوية
        </label>
        <input
          type="text"
          id="languagePreference.secondaryLanguage"
          name="languagePreference.secondaryLanguage"
          value={formData.languagePreference.secondaryLanguage}
          onChange={handleChange}
          placeholder="مثال: الإنجليزية"
          className="w-full border border-gray-300 rounded p-2"
          aria-describedby="secondaryLanguageHelp"
        />
        <p id="secondaryLanguageHelp" className="text-sm text-gray-500 mt-1">
          أدخل اللغة الثانوية إن وجدت
        </p>
      </div>

      {/* Health Status */}
      <div>
        <label className="block font-semibold mb-1">هل تم تطعيم الطفل؟</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="healthStatus.vaccinated"
              value="true"
              checked={formData.healthStatus.vaccinated === true}
              onChange={handleChange}
              className="form-radio"
              aria-label="تطعيم الطفل: نعم"
            />
            <span className="mr-2">نعم</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="healthStatus.vaccinated"
              value="false"
              checked={formData.healthStatus.vaccinated === false}
              onChange={handleChange}
              className="form-radio"
              aria-label="تطعيم الطفل: لا"
            />
            <span className="mr-2">لا</span>
          </label>
        </div>
        <textarea
          name="healthStatus.notes"
          value={formData.healthStatus.notes}
          onChange={handleChange}
          placeholder="ملاحظات صحية إضافية"
          className="w-full border border-gray-300 rounded p-2 mt-2"
          aria-describedby="healthStatusHelp"
        />
        <p id="healthStatusHelp" className="text-sm text-gray-500 mt-1">
          أدخل أي ملاحظات صحية إضافية إن وجدت
        </p>
      </div>

      {/* Zone with Autocomplete */}
      <div>
        <label htmlFor="zone" className="block font-semibold mb-1">
          المنطقة
        </label>
        <Select
          id="zone"
          name="zone"
          options={governorates}
          value={governorates.find((option) => option.value === formData.zone) || null}
          onChange={(selected) =>
            setFormData((prev) => ({ ...prev, zone: selected ? selected.value : "" }))
          }
          placeholder="اختر المنطقة"
          className="w-full"
          classNamePrefix="select"
          isClearable
          aria-describedby="zoneHelp"
        />
        <p id="zoneHelp" className="text-sm text-gray-500 mt-1">
          اختر المنطقة أو اكتبها (سيتم ملؤها تلقائيًا من الرقم القومي إذا أدخلته)
        </p>
      </div>
    </>
  );
}