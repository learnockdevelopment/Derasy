export default function StepperNavigation({
  steps,
  currentStep,
  setCurrentStep,
}) {
  const totalSteps = steps.length
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4">
      {/* Progress Bar Container */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-8">
        {/* Filled Bar */}
        <div
          className="absolute top-0 right-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {/* Dots over the bar */}
        <div className="absolute top-1/2 right-0 w-full flex justify-between -translate-y-1/2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition 
                ${i + 1 <= currentStep ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Step Titles */}
      <div className="flex justify-between text-sm font-medium text-gray-700">
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1
          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index + 1)}
              className={`text-center transition px-2 py-1 rounded ${
                isActive
                  ? "text-blue-700 font-bold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <span className="block text-xs mb-0.5">الخطوة {index + 1}</span>
              <span>{step.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
