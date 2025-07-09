export default function PersonalInfoStep({ formData, errors, handleChange }) {
  const handleNidChange = (e) => {
    const { value } = e.target;

    // تحديث الرقم القومي مباشرة
    handleChange({
      target: {
        name: 'nationalId',
        value,
      },
    });

    if (value.length === 14 && /^\d{14}$/.test(value)) {
      const { birthDate, gender } = extractDataFromNationalId(value);

      if (birthDate) {
        handleChange({
          target: {
            name: 'birthDate',
            value: birthDate,
          },
        });
      }

      if (gender) {
        handleChange({
          target: {
            name: 'gender',
            value: gender,
          },
        });
      }
    }
  };

  const extractDataFromNationalId = (nid) => {
    if (!/^\d{14}$/.test(nid)) return {};

    const century = nid.charAt(0);
    const year = (century === '3' ? '20' : '19') + nid.substring(1, 3);
    const month = nid.substring(3, 5);
    const day = nid.substring(5, 7);
    const birthDate = `${year}-${month}-${day}`;

    const genderDigit = parseInt(nid.charAt(12));
    const gender = genderDigit % 2 === 0 ? 'female' : 'male';

    return { birthDate, gender };
  };

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
          onChange={handleNidChange}
          placeholder="مثال: 31704102300819"
          className={`w-full border ${errors.nationalId ? "border-red-500" : "border-gray-300"} rounded p-2`}
          aria-describedby="nationalIdHelp"
        />
        <p id="nationalIdHelp" className="text-sm text-gray-500 mt-1">
          أدخل الرقم القومي المكون من 14 رقمًا لملء تاريخ الميلاد، الجنس، والمنطقة تلقائيًا
        </p>
        {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId}</p>}
      </div>
      {/* Gender */}
<div>
  <label className="block font-semibold mb-1">الجنس *</label>
  <div className="flex gap-4">
    {/* Male Option */}
    <label
      className={`flex-1 flex items-center justify-center gap-2 border rounded p-3 cursor-pointer transition 
        ${formData.gender === 'male' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 bg-white'}
        hover:border-blue-500`}
    >
      <input
        type="radio"
        name="gender"
        value="male"
        checked={formData.gender === 'male'}
        onChange={handleChange}
        className="hidden"
      />
      {/* Male icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3h8m0 0v8m0-8L10 14" />
        <circle cx="9" cy="15" r="6" stroke="currentColor" strokeWidth="2" />
      </svg>
      ذكر
    </label>

    {/* Female Option */}
    <label
      className={`flex-1 flex items-center justify-center gap-2 border rounded p-3 cursor-pointer transition 
        ${formData.gender === 'female' ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 bg-white'}
        hover:border-pink-500`}
    >
      <input
        type="radio"
        name="gender"
        value="female"
        checked={formData.gender === 'female'}
        onChange={handleChange}
        className="hidden"
      />
      {/* Female icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a5 5 0 100 10 5 5 0 000-10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m-4-4h8" />
      </svg>
      أنثى
    </label>
  </div>
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


    </>
  );
}
