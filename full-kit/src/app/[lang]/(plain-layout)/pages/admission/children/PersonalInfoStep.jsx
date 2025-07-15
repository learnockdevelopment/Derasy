import Select from "react-select"
import {
  Accessibility,
  Church,
  HelpCircle,
  Info,
  Landmark,
  UserCheck,
  UserX,
} from "lucide-react"

import { Nationalities } from "./nationalities"

export default function PersonalInfoStep({ formData, errors, handleChange }) {
  const handleNidChange = (e) => {
    const { value } = e.target

    handleChange({
      target: {
        name: "nationalId",
        value,
      },
    })

    if (value.length === 14 && /^\d{14}$/.test(value)) {
      const { birthDate, gender, birthPlace } = extractDataFromNationalId(value)

      if (birthDate) {
        handleChange({
          target: {
            name: "birthDate",
            value: birthDate,
          },
        })
      }

      if (gender) {
        handleChange({
          target: {
            name: "gender",
            value: gender,
          },
        })
      }

      if (birthPlace) {
        handleChange({
          target: {
            name: "birthPlace",
            value: birthPlace,
          },
        })
      }
    }
  }

  const extractDataFromNationalId = (nid) => {
    if (!/^\d{14}$/.test(nid)) return {}

    const century = nid.charAt(0)
    const year = (century === "3" ? "20" : "19") + nid.substring(1, 3)
    const month = nid.substring(3, 5)
    const day = nid.substring(5, 7)
    const birthDate = `${year}-${month}-${day}`

    const genderDigit = parseInt(nid.charAt(12))
    const gender = genderDigit % 2 === 0 ? "female" : "male"

    const govCode = nid.substring(7, 9)
    const birthPlace = governoratesMap[govCode] || "غير معروف"

    return { birthDate, gender, birthPlace }
  }

  const calculateAgeInComingOctober = (birthDateStr) => {
    const birthDate = new Date(birthDateStr)

    const today = new Date()
    const currentYear =
      today.getMonth() >= 9 ? today.getFullYear() + 1 : today.getFullYear()
    const octoberFirst = new Date(`${currentYear}-10-01`)

    let years = octoberFirst.getFullYear() - birthDate.getFullYear()
    let months = octoberFirst.getMonth() - birthDate.getMonth()
    let days = octoberFirst.getDate() - birthDate.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(
        octoberFirst.getFullYear(),
        octoberFirst.getMonth(),
        0
      )
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years -= 1
      months += 12
    }
    
    return `${years} سنة و ${months} شهر و ${days} يوم`
  }

  const religionOptions = [
    { value: "Muslim", label: "مسلم", icon: <Landmark className="w-5 h-5" /> },
    {
      value: "Christian",
      label: "مسيحي",
      icon: <Church className="w-5 h-5" />,
    },
    { value: "Other", label: "أخرى", icon: <HelpCircle className="w-5 h-5" /> },
  ]
  const governoratesMap = {
    "01": "القاهرة",
    "02": "الإسكندرية",
    "03": "بورسعيد",
    "04": "السويس",
    11: "دمياط",
    12: "الدقهلية",
    13: "الشرقية",
    14: "القليوبية",
    15: "كفر الشيخ",
    16: "الغربية",
    17: "المنوفية",
    18: "البحيرة",
    19: "الإسماعيلية",
    21: "الجيزة",
    22: "بني سويف",
    23: "الفيوم",
    24: "المنيا",
    25: "أسيوط",
    26: "سوهاج",
    27: "قنا",
    28: "أسوان",
    29: "الأقصر",
    31: "البحر الأحمر",
    32: "الوادي الجديد",
    33: "مطروح",
    34: "شمال سيناء",
    35: "جنوب سيناء",
    88: "خارج الجمهورية",
  }

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
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName}</p>
        )}
      </div>

      {/* Nationality Select */}
      <div>
        <label htmlFor="nationality" className="block font-semibold mb-1">
          الجنسية *
        </label>
        <Select
          inputId="nationality"
          options={Nationalities}
          value={Nationalities.find(
            (opt) => opt.value === formData.nationality
          )}
          onChange={(selected) =>
            handleChange({
              target: {
                name: "nationality",
                value: selected?.value || "",
              },
            })
          }
          placeholder="اختر الجنسية"
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable
        />
        {errors.nationality && (
          <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
        )}
      </div>
      {/* Religion */}
      <div>
        <label className="block font-semibold mb-2 flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-gray-600" />
          الديانة
        </label>
        <div className="grid grid-cols-3 gap-4">
          {religionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleChange({
                  target: { name: "religion", value: option.value },
                })
              }
              className={`flex flex-col items-center gap-1 border p-3 rounded-lg transition-all duration-150 ${
                formData.religion === option.value
                  ? "bg-blue-100 border-blue-600 text-blue-700"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
        <p id="religionHelp" className="text-sm text-gray-500 mt-2">
          اختر الدين إن أردت
        </p>
      </div>
      {/* National ID */}

      <div>
        <label htmlFor="nationalId" className="block font-semibold mb-1">
          {formData.nationality === "مصري" ? "الرقم القومي" : "رقم الهوية"} *
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
          {formData.nationality === "مصري"
            ? "أدخل الرقم القومي المكون من 14 رقمًا للتعرف على تاريخ الميلاد، الجنس، السن في اول اكتوبر و محل الميلاد تلقائيًا"
            : "أدخل رقم الهوية الوطنية حسب جنسيتك"}
        </p>

        {errors.nationalId && (
          <p className="text-red-500 text-sm">{errors.nationalId}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block font-semibold mb-1">الجنس *</label>
        <div className="flex gap-4">
          {/* Male Option */}
          <label
            className={`flex-1 flex items-center justify-center gap-2 border rounded p-3 cursor-pointer transition 
              ${formData.gender === "male" ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 bg-white"}
              hover:border-blue-500`}
          >
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="hidden"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 3h8m0 0v8m0-8L10 14"
              />
              <circle
                cx="9"
                cy="15"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            ذكر
          </label>

          {/* Female Option */}
          <label
            className={`flex-1 flex items-center justify-center gap-2 border rounded p-3 cursor-pointer transition 
              ${formData.gender === "female" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300 bg-white"}
              hover:border-pink-500`}
          >
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="hidden"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4a5 5 0 100 10 5 5 0 000-10z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14v7m-4-4h8"
              />
            </svg>
            أنثى
          </label>
        </div>
        <p id="genderHelp" className="text-sm text-gray-500 mt-1">
          اختر جنس الطفل
        </p>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}
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
          disabled={formData.nationality !== "مصري"}
          value={formData.birthDate}
          onChange={handleChange}
          className={`w-full border rounded p-2 transition
      ${formData.nationality !== "مصري" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
      ${errors.birthDate ? "border-red-500" : "border-gray-300"}`}
          required
          aria-describedby="birthDateHelp"
        />
        <p id="birthDateHelp" className="text-sm text-gray-500 mt-1">
          أدخل تاريخ ميلاد الطفل (سيتم ملؤه تلقائيًا من الرقم القومي إذا أدخلته)
        </p>
        {errors.birthDate && (
          <p className="text-red-500 text-sm">{errors.birthDate}</p>
        )}
      </div>

      {/* Birth Place */}
      <div>
        <label htmlFor="birthPlace" className="block font-semibold mb-1">
          محل الميلاد
        </label>
        <input
          type="text"
          id="birthPlace"
          name="birthPlace"
          value={formData.birthPlace || ""}
          onChange={handleChange}
          placeholder="مثال: القاهرة"
          className={`w-full border ${errors.birthPlace ? "border-red-500" : "border-gray-300"} rounded p-2`}
          aria-describedby="birthPlaceHelp"
        />
        <p id="birthPlaceHelp" className="text-sm text-gray-500 mt-1">
          أدخل مكان ولادة الطفل (سيتم ملؤه تلقائيًا إن أمكن من الرقم القومي)
        </p>
        {errors.birthPlace && (
          <p className="text-red-500 text-sm">{errors.birthPlace}</p>
        )}
      </div>

      {/* Age in Coming October (read-only) */}
      {formData.birthDate && (
        <div>
          <label className="block font-semibold mb-1">
            العمر في 1 أكتوبر القادم
          </label>
          <input
            type="text"
            readOnly
            value={calculateAgeInComingOctober(formData.birthDate)}
            className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded p-2 cursor-not-allowed"
          />
        </div>
      )}
    </>
  )
}
