export default function SchoolInfoStep({ formData, errors, handleChange }) {
  return (
    <>
      {/* Current School */}
      <div>
        <label htmlFor="currentSchool" className="block font-semibold mb-1">
          المدرسة الحالية
        </label>
        <input
          type="text"
          id="currentSchool"
          name="currentSchool"
          value={formData.currentSchool}
          onChange={handleChange}
          placeholder="اسم المدرسة الحالية"
          className="w-full border border-gray-300 rounded p-2"
          aria-describedby="currentSchoolHelp"
        />
        <p id="currentSchoolHelp" className="text-sm text-gray-500 mt-1">
          أدخل اسم المدرسة الحالية إن وجدت
        </p>
      </div>

      {/* Current Grade */}
      <div>
        <label htmlFor="currentGrade" className="block font-semibold mb-1">
          الصف الحالي
        </label>
        <input
          type="text"
          id="currentGrade"
          name="currentGrade"
          value={formData.currentGrade}
          onChange={handleChange}
          placeholder="مثال: KG2"
          className="w-full border border-gray-300 rounded p-2"
          aria-describedby="currentGradeHelp"
        />
        <p id="currentGradeHelp" className="text-sm text-gray-500 mt-1">
          أدخل الصف الحالي للطفل (مثال: KG1، الصف الأول الابتدائي)
        </p>
      </div>

      {/* Desired Grade */}
      <div>
        <label htmlFor="desiredGrade" className="block font-semibold mb-1">
          الصف المرغوب *
        </label>
        <input
          type="text"
          id="desiredGrade"
          name="desiredGrade"
          value={formData.desiredGrade}
          onChange={handleChange}
          placeholder="مثال: الصف الأول الابتدائي"
          className={`w-full border ${errors.desiredGrade ? "border-red-500" : "border-gray-300"} rounded p-2`}
          required
          aria-describedby="desiredGradeHelp"
        />
        <p id="desiredGradeHelp" className="text-sm text-gray-500 mt-1">
          أدخل الصف الذي ترغب في تسجيل الطفل فيه
        </p>
        {errors.desiredGrade && <p className="text-red-500 text-sm">{errors.desiredGrade}</p>}
      </div>
    </>
  );
}