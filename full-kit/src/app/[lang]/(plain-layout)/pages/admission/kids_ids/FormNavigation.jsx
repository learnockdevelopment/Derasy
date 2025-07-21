export default function FormNavigation({ currentStep, steps, isSubmitting, handlePrevious, handleNext }) {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={handlePrevious}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
        >
          السابق
        </button>
      )}
      {currentStep < steps.length ? (
        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          التالي
        </button>
      ) : (
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الإرسال..." : "إضافة الطفل"}
        </button>
      )}
    </div>
  );
}