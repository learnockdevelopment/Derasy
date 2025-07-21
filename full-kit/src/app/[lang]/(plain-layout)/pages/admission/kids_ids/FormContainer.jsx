import EducationTypeStep from "./EducationTypeStep"; // ✅ New first step
import PersonalInfoStep from "./PersonalInfoStep";
import SchoolInfoStep from "./SchoolInfoStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import HealthAndLocationStep from "./HealthAndLocationStep";
import FormNavigation from "./FormNavigation";
import ApplicationTypeStep from "./ProcessType"; // ✅ New first step

export default function FormContainer({
  currentStep,
  formData,
  errors,
  handleChange,
  handleSubmit,
  handlePrevious,
  handleNext,
  isSubmitting,
  governorates,
  setFormData,
  steps,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-right">
      {currentStep === 0 && (
        <ApplicationTypeStep
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      )}

      {currentStep === 1 && (
        <EducationTypeStep
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      )}
      {currentStep === 2 && (
        <PersonalInfoStep
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      )}
      {currentStep === 3 && (
        <SchoolInfoStep
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          setFormData={setFormData}
        />
      )}
      {currentStep === 4 && (
        <AdditionalInfoStep
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      )}
      {currentStep === 5 && (
        <HealthAndLocationStep
          formData={formData}
          errors={errors}
          setFormData={setFormData}
          handleChange={handleChange}
          governorates={governorates}
        />
      )}

      <FormNavigation
        currentStep={currentStep}
        steps={steps}
        isSubmitting={isSubmitting}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />
    </form>
  );
}
