export default function PersonalInfoStep({ formData, errors, handleChange }) {
  return (
    <>
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block font-semibold mb-1">
          الاسم الكامل *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="مثال: نور محمد حسن"
          className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded p-2`}
          required
          aria-describedby="fullNameHelp"
        />
        <p id="fullNameHelp" className="text-sm text-gray-500 mt-1">
          أدخل الاسم الأول واسم العائلة على الأقل
        </p>
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block font-semibold mb-1">
          الجنس *
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`w-full border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded p-2`}
          required
          aria-describedby="genderHelp"
        >
          <option value="">اختر الجنس</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        <p id="genderHelp" className="text-sm text-gray-500 mt-1">
          اختر جنس الطفل
        </p>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
      </div>

      {/* Birth Date */}
      <div>
        <label htmlFor="birthDate" className="block font-semibold mb-1">
          تاريخ الميلاد *
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={`w-full border ${errors.birthDate ? "border-red-500" : "border-gray-300"} rounded p-2`}
          required
          aria-describedby="birthDateHelp"
        />
        <p id="birthDateHelp" className="text-sm text-gray-500 mt-1">
          أدخل تاريخ ميلاد الطفل (سيتم ملؤه تلقائيًا من الرقم القومي إذا أدخلته)
        </p>
        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
      </div>

      {/* National ID */}
      <div>
        <label htmlFor="nationalId" className="block font-semibold mb-1">
          الرقم القومي
        </label>
        <input
          type="text"
          id="nationalId"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleChange}
          placeholder="مثال: 31704102300819"
          className={`w-full border ${errors.nationalId ? "border-red-500" : "border-gray-300"} rounded p-2`}
          aria-describedby="nationalIdHelp"
        />
        <p id="nationalIdHelp" className="text-sm text-gray-500 mt-1">
          أدخل الرقم القومي المكون من 14 رقمًا لملء تاريخ الميلاد، الجنس، والمنطقة تلقائيًا
        </p>
        {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId}</p>}
      </div>
    </>
  );
}