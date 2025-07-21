import Select from 'react-select';

export default function SchoolInfoStep({ formData, errors, handleChange, setFormData }) {
  const egyptianGrades = [
    'KG1',
    'KG2',
    'الصف الأول الابتدائي',
    'الصف الثاني الابتدائي',
    'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي',
    'الصف الخامس الابتدائي',
    'الصف السادس الابتدائي',
    'الصف الأول الإعدادي',
    'الصف الثاني الإعدادي',
    'الصف الثالث الإعدادي',
    'الصف الأول الثانوي',
    'الصف الثاني الثانوي',
    'الصف الثالث الثانوي',
  ].map((grade) => ({ label: grade, value: grade }));

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : '',
    }));
    // Clear error if value is selected
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedOption.value,
      }));
    }
  };

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
      <div className="mt-4">
        <label className="block font-semibold mb-1">الصف الحالي</label>
        <Select
          options={egyptianGrades}
          value={egyptianGrades.find((g) => g.value === formData.currentGrade)}
          onChange={handleSelectChange('currentGrade')}
          placeholder="اختر الصف الحالي"
          className="react-select-container"
          classNamePrefix="react-select"
          instanceId="currentGradeSelect"
          aria-describedby="currentGradeHelp"
        />
        <p id="currentGradeHelp" className="text-sm text-gray-500 mt-1">
          أدخل الصف الحالي للطفل (مثال: KG1، الصف الأول الابتدائي)
        </p>
      </div>

      {/* Desired Grade */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">الصف المرغوب *</label>
        <Select
          options={egyptianGrades}
          value={egyptianGrades.find((g) => g.value === formData.desiredGrade)}
          onChange={handleSelectChange('desiredGrade')}
          placeholder="اختر الصف المرغوب"
          className="react-select-container"
          classNamePrefix="react-select"
          instanceId="desiredGradeSelect"
          aria-describedby="desiredGradeHelp"
        />
        <p id="desiredGradeHelp" className="text-sm text-gray-500 mt-1">
          أدخل الصف الذي ترغب في تسجيل الطفل فيه
        </p>
        {errors.desiredGrade && (
          <p className="text-red-500 text-sm mt-1">{errors.desiredGrade}</p>
        )}
      </div>
    </>
  );
}
