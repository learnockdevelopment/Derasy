'use client';

import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import StepperNavigation from './StepperNavigation';
import FormContainer from './FormContainer';
import useValidation from './useValidation';
import useAuth from './useAuth';

export default function ChildrenAddPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    birthDate: '',
    nationalId: '',
    currentSchool: '',
    currentGrade: '',
    desiredGrade: '',
    religion: '',
    specialNeeds: { hasNeeds: false, description: '' },
    languagePreference: { primaryLanguage: '', secondaryLanguage: '' },
    healthStatus: { vaccinated: false, notes: '' },
    zone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const governorates = [
    { value: 'القاهرة', label: 'القاهرة' },
    { value: 'الإسكندرية', label: 'الإسكندرية' },
    { value: 'بورسعيد', label: 'بورسعيد' },
    { value: 'السويس', label: 'السويس' },
    { value: 'دمياط', label: 'دمياط' },
    { value: 'الدقهلية', label: 'الدقهلية' },
    { value: 'الشرقية', label: 'الشرقية' },
    { value: 'القليوبية', label: 'القليوبية' },
    { value: 'كفر الشيخ', label: 'كفر الشيخ' },
    { value: 'الغربية', label: 'الغربية' },
    { value: 'المنوفية', label: 'المنوفية' },
    { value: 'البحيرة', label: 'البحيرة' },
    { value: 'الإسماعيلية', label: 'الإسماعيلية' },
    { value: 'الجيزة', label: 'الجيزة' },
  ];

  const steps = [
    { title: 'المعلومات الشخصية', fields: ['fullName', 'gender', 'birthDate', 'nationalId'] },
    { title: 'معلومات المدرسة', fields: ['currentSchool', 'currentGrade', 'desiredGrade'] },
    { title: 'معلومات إضافية', fields: ['religion', 'specialNeeds'] },
    { title: 'الصحة والموقع', fields: ['languagePreference', 'healthStatus', 'zone'] },
  ];

  const { validateField, validateStep, debouncedExtractFromNationalId } = useValidation(setFormData, setErrors);
  const { showLoginPopup } = useAuth();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === 'nationalId') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      debouncedExtractFromNationalId(value);
      return;
    }

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: type === 'checkbox' || type === 'radio' ? (value === 'true' || checked) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' || type === 'radio' ? (value === 'true' || checked) : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      nationalId: validateField('nationalId', formData.nationalId),
      gender: formData.gender ? '' : 'الرجاء اختيار الجنس',
      birthDate: formData.birthDate ? '' : 'الرجاء إدخال تاريخ الميلاد',
      desiredGrade: formData.desiredGrade ? '' : 'الرجاء إدخال الصف المرغوب',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      toast({
        title: 'خطأ في الإدخال',
        description: 'الرجاء تصحيح الحقول المطلوبة.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1] || null;

      toast({
        title: 'جاري حفظ البيانات...',
        description: 'نقوم الآن بمعالجة طلبك.',
      });

      const res = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 403) {
  showLoginPopup(async () => {
    // Retry submission after successful login
    handleSubmit(e);
  });
  return;
}


      if (res.ok) {
        toast({
          title: 'تم التسجيل بنجاح',
          description: `تم تسجيل الطفل ${formData.fullName} بنجاح.`,
        });

        setFormData({
          fullName: '',
          gender: '',
          birthDate: '',
          nationalId: '',
          currentSchool: '',
          currentGrade: '',
          desiredGrade: '',
          religion: '',
          specialNeeds: { hasNeeds: false, description: '' },
          languagePreference: { primaryLanguage: '', secondaryLanguage: '' },
          healthStatus: { vaccinated: false, notes: '' },
          zone: '',
        });
        setErrors({});
        setCurrentStep(1);
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'حدث خطأ أثناء الحفظ.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ في الاتصال',
        description: 'تعذر الاتصال بالخادم.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNext = () => {
    const stepErrors = validateStep(steps[currentStep - 1].fields, formData);
    setErrors((prev) => ({ ...prev, ...stepErrors }));

    if (Object.values(stepErrors).some((error) => error)) {
      toast({
        title: 'خطأ في هذه الخطوة',
        description: 'يرجى إكمال الحقول المطلوبة قبل المتابعة.',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="py-16 space-y-16 bg-muted/40">
      <div className="mx-auto p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center">إضافة بيانات الطفل</h1>
        <StepperNavigation steps={steps} currentStep={currentStep} />
        <FormContainer
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          governorates={governorates}
          steps={steps}
        />
      </div>
    </div>
  );
}
