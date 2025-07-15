import {
  Accessibility,
  Church,
  HelpCircle,
  Info,
  Landmark,
  UserCheck,
  UserX,
} from "lucide-react"

export default function AdditionalInfoStep({ formData, errors, handleChange }) {
  const specialNeedsOptions = [
    {
      value: true,
      label: "نعم",
      icon: <UserCheck className="w-5 h-5 text-green-600" />,
    },
    {
      value: false,
      label: "لا",
      icon: <UserX className="w-5 h-5 text-red-600" />,
    },
  ]

  return (
    <>
      {/* Special Needs */}
      <div className="mt-6">
        <label className="block font-semibold mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-600" />
          هل يوجد احتياجات خاصة؟
        </label>
        <div className="grid grid-cols-2 gap-4">
          {specialNeedsOptions.map((option) => (
            <button
              key={option.value.toString()}
              type="button"
              onClick={() =>
                handleChange({
                  target: {
                    name: "specialNeeds.hasNeeds",
                    value: option.value.toString(),
                  },
                })
              }
              className={`flex items-center justify-center gap-2 border p-3 rounded-lg transition-all duration-150 ${
                formData.specialNeeds.hasNeeds === option.value
                  ? "bg-blue-100 border-blue-600 text-blue-700"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>

        {formData.specialNeeds.hasNeeds && (
          <textarea
            name="specialNeeds.description"
            value={formData.specialNeeds.description}
            onChange={handleChange}
            placeholder="صف الاحتياجات الخاصة"
            className="w-full border border-gray-300 rounded p-2 mt-3"
            aria-describedby="specialNeedsHelp"
          />
        )}

        <p id="specialNeedsHelp" className="text-sm text-gray-500 mt-2">
          إذا كان هناك احتياجات خاصة، يرجى وصفها بالتفصيل
        </p>
      </div>
    </>
  )
}
