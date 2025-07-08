export default function StepperNavigation({ steps, currentStep }) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex-1 text-center p-2 rounded ${
            currentStep === index + 1
              ? "bg-blue-600 text-white"
              : currentStep > index + 1
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <span className="font-semibold">{step.title}</span>
        </div>
      ))}
    </div>
  );
}