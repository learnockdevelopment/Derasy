export default function SubmitButton() {
  return (
    <div className="pt-6">
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <span>إرسال الطلب</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  )
}
