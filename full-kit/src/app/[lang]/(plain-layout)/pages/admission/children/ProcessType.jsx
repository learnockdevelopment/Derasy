import { UserPlus, Repeat } from "lucide-react";

export default function ApplicationTypeStep({ formData, errors, handleChange }) {
  const applicationOptions = [
    {
      value: "new",
      label: "تقديم لطالب جديد",
      icon: <UserPlus className="w-5 h-5 text-green-600" />,
    },
    {
      value: "transfer",
      label: "تحويل لطالب من مدرسة أخرى",
      icon: <Repeat className="w-5 h-5 text-blue-600" />,
    },
  ];

  return (
    <div className="mt-6">
      <label className="block font-semibold mb-2 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-gray-600" />
        نوع الطلب
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {applicationOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "applicationType",
                  value: option.value,
                },
              })
            }
            className={`flex items-center justify-start gap-3 border p-4 rounded-lg transition-all duration-150 text-right ${
              formData.applicationType === option.value
                ? "bg-blue-100 border-blue-600 text-blue-700"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {errors.applicationType && (
        <p className="text-sm text-red-500 mt-2">{errors.applicationType}</p>
      )}
    </div>
  );
}
