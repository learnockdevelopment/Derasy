"use client"

export default function FormField({ field, value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {field.key}
        <span className="text-red-500">*</span>
      </label>

      {field.type === "text" && (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm"
          required
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm"
          required
        />
      )}

      {field.type === "date" && (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm"
          required
        />
      )}

      {field.type === "photo" && (
        <div className="flex items-center space-x-4">
          <label className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 bg-gray-50">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="text-sm text-gray-500">
              {value ? value.name : "اختر صورة"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange(field.key, e.target.files[0])}
              className="hidden"
            />
          </label>
          {value && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
              <img
                src={URL.createObjectURL(value)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {field.type === "select" && (
        <select
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
          required
        >
          <option value="">اختر {field.key}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
