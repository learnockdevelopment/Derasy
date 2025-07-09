export default function StepperNavigation({ steps, currentStep, setCurrentStep }) {
  return (
    <div className="flex justify-center mb-8 gap-4 flex-wrap">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;

        return (
          <button
            key={index}
            onClick={() => setCurrentStep(stepNumber)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <span className="font-bold">{stepNumber}.</span> {step.title}
          </button>
        );
      })}
    </div>
  );
}
