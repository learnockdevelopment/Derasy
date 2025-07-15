import { GraduationCap, BookOpen, Globe, School, Landmark } from "lucide-react";

export default function EducationTypeStep({ formData, errors, handleChange }) {
  const educationTypeOptions = [
    { value: "national", label: "ناشونال", icon: <Globe className="w-5 h-5 text-blue-500" /> },
    { value: "international", label: "إنترناشونال", icon: <Globe className="w-5 h-5 text-indigo-500" /> },
    { value: "experimental", label: "تجريبية", icon: <BookOpen className="w-5 h-5 text-purple-500" /> },
    { value: "distinguished_official", label: "الرسمية المتميزة", icon: <School className="w-5 h-5 text-pink-500" /> },
    { value: "government", label: "حكومية", icon: <Landmark className="w-5 h-5 text-green-600" /> },
    { value: "nuns", label: "راهبات", icon: <GraduationCap className="w-5 h-5 text-rose-500" /> },
    { value: "semi_international", label: "سيمي انترناشونال", icon: <Globe className="w-5 h-5 text-yellow-600" /> },
    { value: "nationalism", label: "قومية", icon: <BookOpen className="w-5 h-5 text-orange-500" /> },
    { value: "private_azhari", label: "ازهري خاص", icon: <Landmark className="w-5 h-5 text-gray-700" /> },
    { value: "technical_applied", label: "التكنولوجيا التطبيقية", icon: <School className="w-5 h-5 text-blue-700" /> },
    { value: "monks", label: "رهبان", icon: <GraduationCap className="w-5 h-5 text-red-500" /> },
    { value: "azhari", label: "أزهري", icon: <Landmark className="w-5 h-5 text-green-700" /> },
  ];

  return (
    <div className="mt-6">
      <label className="block font-semibold mb-2 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-gray-600" />
        اختر نوع التعليم
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {educationTypeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "educationType",
                  value: option.value,
                },
              })
            }
            className={`flex items-center justify-start gap-3 border p-4 rounded-lg transition-all duration-150 text-right ${
              formData.educationType === option.value
                ? "bg-blue-100 border-blue-600 text-blue-700"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {errors.educationType && (
        <p className="text-sm text-red-500 mt-2">{errors.educationType}</p>
      )}
    </div>
  );
}
