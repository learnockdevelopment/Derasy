"use client";

import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import Select from "react-select"; // For autocomplete
import debounce from "lodash/debounce";

export default function ChildrenAddPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    nationalId: "",
    currentSchool: "",
    currentGrade: "",
    desiredGrade: "",
    religion: "",
    specialNeeds: { hasNeeds: false, description: "" },
    languagePreference: { primaryLanguage: "", secondaryLanguage: "" },
    healthStatus: { vaccinated: false, notes: "" },
    zone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const governorates = [
    { value: "القاهرة", label: "القاهرة" },
    { value: "الإسكندرية", label: "الإسكندرية" },
    { value: "بورسعيد", label: "بورسعيد" },
    { value: "السويس", label: "السويس" },
    { value: "دمياط", label: "دمياط" },
    { value: "الدقهلية", label: "الدقهلية" },
    { value: "الشرقية", label: "الشرقية" },
    { value: "القليوبية", label: "القليوبية" },
    { value: "كفر الشيخ", label: "كفر الشيخ" },
    { value: "الغربية", label: "الغربية" },
    { value: "المنوفية", label: "المنوفية" },
    { value: "البحيرة", label: "البحيرة" },
    { value: "الإسماعيلية", label: "الإسماعيلية" },
    { value: "الجيزة", label: "الجيزة" },
  ];

  const validateFullName = (name) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? "" : "الاسم الكامل يجب أن يحتوي على اسمين على الأقل";
  };

  const validateNationalId = (id) => {
    const cleanId = id.replace(/\D/g, "");
    return cleanId.length === 14 ? "" : "الرقم القومي يجب أن يتكون من 14 رقمًا";
  };

  const validateField = (name, value) => {
    if (name === "fullName") return validateFullName(value);
    if (name === "nationalId") return validateNationalId(value);
    return "";
  };

  const debouncedExtractFromNationalId = useCallback(
    debounce((id) => {
      const extracted = extractFromNationalId(id);
      if (extracted) {
        setFormData((prev) => ({
          ...prev,
          birthDate: extracted.birthDate,
          gender: extracted.gender,
          zone: extracted.zone || prev.zone,
          nationalId: id,
        }));
        setErrors((prev) => ({ ...prev, nationalId: "" }));
      } else {
        setErrors((prev) => ({ ...prev, nationalId: validateNationalId(id) }));
      }
    }, 500),
    []
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "nationalId") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      debouncedExtractFromNationalId(value);
      return;
    }

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function extractFromNationalId(id) {
    const cleanId = id.replace(/\D/g, "");
    if (cleanId.length !== 14) return null;

    let year = parseInt(cleanId.slice(0, 2));
    year = year < 50 ? 2000 + year : 1900 + year;
    const month = parseInt(cleanId.slice(2, 4));
    const day = parseInt(cleanId.slice(4, 6));
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    const birthDate = `${year.toString().padStart(4, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const genderDigit = parseInt(cleanId.charAt(6));
    const gender = genderDigit % 2 === 0 ? "female" : "male";
    const governorateCode = cleanId.slice(7, 9);

    const governoratesMap = {
      "01": "القاهرة",
      "02": "الإسكندرية",
      "03": "بورسعيد",
      "04": "السويس",
      "11": "دمياط",
      "12": "الدقهلية",
      "13": "الشرقية",
      "14": "القليوبية",
      "15": "كفر الشيخ",
      "16": "الغربية",
      "17": "المنوفية",
      "18": "البحيرة",
      "19": "الإسماعيلية",
      "21": "الجيزة",
    };
    const zone = governoratesMap[governorateCode] || "";

    return { birthDate, gender, zone };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {
      fullName: validateFullName(formData.fullName),
      nationalId: validateNationalId(formData.nationalId),
      gender: formData.gender ? "" : "الرجاء اختيار الجنس",
      birthDate: formData.birthDate ? "" : "الرجاء إدخال تاريخ الميلاد",
      desiredGrade: formData.desiredGrade ? "" : "الرجاء إدخال الصف المرغوب",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setIsSubmitting(false);
      return Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "الرجاء تصحيح الحقول المطلوبة.",
        confirmButtonText: "حسنًا",
      });
    }

    try {
      // 1. Get the token from cookies
      function getTokenFromCookies() {
        const tokenMatch = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
        return tokenMatch ? tokenMatch.split("=")[1] : null;
      }

      // 2. Use it in the fetch call
      const token = getTokenFromCookies();

      const res = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // only if token exists
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.status === 403) {
        setIsSubmitting(false);
        return showLoginPopup();
      }
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة بنجاح",
          text: `تم تسجيل بيانات الطفل ${formData.fullName} بنجاح!`,
          confirmButtonText: "شكرًا",
        });
        setFormData({
          fullName: "",
          gender: "",
          birthDate: "",
          nationalId: "",
          currentSchool: "",
          currentGrade: "",
          desiredGrade: "",
          religion: "",
          specialNeeds: { hasNeeds: false, description: "" },
          languagePreference: { primaryLanguage: "", secondaryLanguage: "" },
          healthStatus: { vaccinated: false, notes: "" },
          zone: "",
        });
        setErrors({});
        setCurrentStep(1); // Reset to first step
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.message || "حدث خطأ أثناء الإضافة.",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الاتصال",
        text: "فشل الاتصال بالخادم.",
        confirmButtonText: "حسنًا",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function showLoginPopup() {
    Swal.fire({
      title: "تسجيل الدخول",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="البريد الإلكتروني" type="email" aria-label="البريد الإلكتروني" />
        <input id="swal-input2" class="swal2-input" placeholder="كلمة المرور" type="password" aria-label="كلمة المرور" />
      `,
      focusConfirm: false,
      showCancelButton: false,
      confirmButtonText: "تسجيل الدخول",
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#swal-input1").value;
        const password = Swal.getPopup().querySelector("#swal-input2").value;
        if (!email || !password) {
          Swal.showValidationMessage(`الرجاء إدخال البريد الإلكتروني وكلمة المرور`);
        }
        return { email, password };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.value),
          });
          const data = await res.json();
          if (!res.ok) {
            await Swal.fire({
              icon: "error",
              title: "فشل تسجيل الدخول",
              text: data.message || "حدث خطأ أثناء تسجيل الدخول.",
              confirmButtonText: "حاول مرة أخرى",
            });
            showLoginPopup();
          } else {
            document.cookie = `token=${data.token}; path=/; max-age=86400; secure`;

            await Swal.fire({
              icon: "success",
              title: "تم تسجيل الدخول",
              text: "تم تسجيل الدخول بنجاح",
              confirmButtonText: "حسناً",
            });

            window.location.reload();
          }
        } catch (error) {
          await Swal.fire({
            icon: "error",
            title: "خطأ في الاتصال",
            text: "فشل الاتصال بالخادم.",
            confirmButtonText: "حسنًا",
          });
          showLoginPopup();
        }
      }
    });
  }

  const steps = [
    { title: "المعلومات الشخصية", fields: ["fullName", "gender", "birthDate", "nationalId"] },
    { title: "معلومات المدرسة", fields: ["currentSchool", "currentGrade", "desiredGrade"] },
    { title: "معلومات إضافية", fields: ["religion", "specialNeeds"] },
    { title: "الصحة والموقع", fields: ["languagePreference", "healthStatus", "zone"] },
  ];

  const handleNext = () => {
    const currentStepFields = steps[currentStep - 1].fields;
    const stepErrors = {};
    currentStepFields.forEach((field) => {
      if (field === "fullName") stepErrors.fullName = validateFullName(formData.fullName);
      if (field === "nationalId") stepErrors.nationalId = validateNationalId(formData.nationalId);
      if (field === "gender" && !formData.gender) stepErrors.gender = "الرجاء اختيار الجنس";
      if (field === "birthDate" && !formData.birthDate) stepErrors.birthDate = "الرجاء إدخال تاريخ الميلاد";
      if (field === "desiredGrade" && !formData.desiredGrade) stepErrors.desiredGrade = "الرجاء إدخال الصف المرغوب";
    });

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    if (Object.values(stepErrors).some((error) => error)) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "الرجاء تصحيح الحقول المطلوبة في هذه الخطوة.",
        confirmButtonText: "حسنًا",
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

        {/* Stepper Navigation */}
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 rounded ${currentStep === index + 1
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

        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          {currentStep === 1 && (
            <>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block font-semibold mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="مثال: نور محمد حسن"
                  className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded p-2`}
                  required
                  aria-describedby="fullNameHelp"
                />
                <p id="fullNameHelp" className="text-sm text-gray-500 mt-1">
                  أدخل الاسم الأول واسم العائلة على الأقل
                </p>
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block font-semibold mb-1">
                  الجنس *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded p-2`}
                  required
                  aria-describedby="genderHelp"
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                <p id="genderHelp" className="text-sm text-gray-500 mt-1">
                  اختر جنس الطفل
                </p>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block font-semibold mb-1">
                  تاريخ الميلاد *
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full border ${errors.birthDate ? "border-red-500" : "border-gray-300"} rounded p-2`}
                  required
                  aria-describedby="birthDateHelp"
                />
                <p id="birthDateHelp" className="text-sm text-gray-500 mt-1">
                  أدخل تاريخ ميلاد الطفل (سيتم ملؤه تلقائيًا من الرقم القومي إذا أدخلته)
                </p>
                {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
              </div>

              {/* National ID */}
              <div>
                <label htmlFor="nationalId" className="block font-semibold mb-1">
                  الرقم القومي
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="مثال: 31704102300819"
                  className={`w-full border ${errors.nationalId ? "border-red-500" : "border-gray-300"} rounded p-2`}
                  aria-describedby="nationalIdHelp"
                />
                <p id="nationalIdHelp" className="text-sm text-gray-500 mt-1">
                  أدخل الرقم القومي المكون من 14 رقمًا لملء تاريخ الميلاد، الجنس، والمنطقة تلقائيًا
                </p>
                {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId}</p>}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Current School */}
              <div>
                <label htmlFor="currentSchool" className="block font-semibold mb-1">
                  المدرسة الحالية
                </label>
                <input
                  type="text"
                  id="currentSchool"
                  name="currentSchool"
                  value={formData.currentSchool}
                  onChange={handleChange}
                  placeholder="اسم المدرسة الحالية"
                  className="w-full border border-gray-300 rounded p-2"
                  aria-describedby="currentSchoolHelp"
                />
                <p id="currentSchoolHelp" className="text-sm text-gray-500 mt-1">
                  أدخل اسم المدرسة الحالية إن وجدت
                </p>
              </div>

              {/* Current Grade */}
              <div>
                <label htmlFor="currentGrade" className="block font-semibold mb-1">
                  الصف الحالي
                </label>
                <input
                  type="text"
                  id="currentGrade"
                  name="currentGrade"
                  value={formData.currentGrade}
                  onChange={handleChange}
                  placeholder="مثال: KG2"
                  className="w-full border border-gray-300 rounded p-2"
                  aria-describedby="currentGradeHelp"
                />
                <p id="currentGradeHelp" className="text-sm text-gray-500 mt-1">
                  أدخل الصف الحالي للطفل (مثال: KG1، الصف الأول الابتدائي)
                </p>
              </div>

              {/* Desired Grade */}
              <div>
                <label htmlFor="desiredGrade" className="block font-semibold mb-1">
                  الصف المرغوب *
                </label>
                <input
                  type="text"
                  id="desiredGrade"
                  name="desiredGrade"
                  value={formData.desiredGrade}
                  onChange={handleChange}
                  placeholder="مثال: الصف الأول الابتدائي"
                  className={`w-full border ${errors.desiredGrade ? "border-red-500" : "border-gray-300"} rounded p-2`}
                  required
                  aria-describedby="desiredGradeHelp"
                />
                <p id="desiredGradeHelp" className="text-sm text-gray-500 mt-1">
                  أدخل الصف الذي ترغب في تسجيل الطفل فيه
                </p>
                {errors.desiredGrade && <p className="text-red-500 text-sm">{errors.desiredGrade}</p>}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {/* Religion */}
              <div>
                <label htmlFor="religion" className="block font-semibold mb-1">
                  الدين
                </label>
                <select
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  aria-describedby="religionHelp"
                >
                  <option value="">اختر الدين</option>
                  <option value="Muslim">مسلم</option>
                  <option value="Christian">مسيحي</option>
                  <option value="Other">أخرى</option>
                </select>
                <p id="religionHelp" className="text-sm text-gray-500 mt-1">
                  اختر الدين إن أردت
                </p>
              </div>

              {/* Special Needs */}
              <div>
                <label className="block font-semibold mb-1">هل يوجد احتياجات خاصة؟</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="specialNeeds.hasNeeds"
                      value="true"
                      checked={formData.specialNeeds.hasNeeds === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          specialNeeds: { ...prev.specialNeeds, hasNeeds: true },
                        }))
                      }
                      className="form-radio"
                      aria-label="احتياجات خاصة: نعم"
                    />
                    <span className="mr-2">نعم</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="specialNeeds.hasNeeds"
                      value="false"
                      checked={formData.specialNeeds.hasNeeds === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          specialNeeds: { ...prev.specialNeeds, hasNeeds: false, description: "" },
                        }))
                      }
                      className="form-radio"
                      aria-label="احتياجات خاصة: لا"
                    />
                    <span className="mr-2">لا</span>
                  </label>
                </div>
                {formData.specialNeeds.hasNeeds && (
                  <textarea
                    name="specialNeeds.description"
                    value={formData.specialNeeds.description}
                    onChange={handleChange}
                    placeholder="صف الاحتياجات الخاصة"
                    className="w-full border border-gray-300 rounded p-2 mt-2"
                    aria-describedby="specialNeedsHelp"
                  />
                )}
                <p id="specialNeedsHelp" className="text-sm text-gray-500 mt-1">
                  إذا كان هناك احتياجات خاصة، يرجى وصفها بالتفصيل
                </p>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              {/* Language Preference */}
              <div>
                <label className="block font-semibold mb-1">اللغة الأساسية</label>
                <select
                  name="languagePreference.primaryLanguage"
                  value={formData.languagePreference.primaryLanguage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  aria-describedby="primaryLanguageHelp"
                >
                  <option value="">اختر اللغة</option>
                  <option value="Arabic">العربية</option>
                  <option value="English">الإنجليزية</option>
                  <option value="French">الفرنسية</option>
                  <option value="German">الألمانية</option>
                  <option value="Other">أخرى</option>
                </select>
                <p id="primaryLanguageHelp" className="text-sm text-gray-500 mt-1">
                  اختر اللغة الأساسية لتعليم الطفل
                </p>
              </div>

              <div>
                <label
                  htmlFor="languagePreference.secondaryLanguage"
                  className="block font-semibold mb-1"
                >
                  اللغة الثانوية
                </label>
                <input
                  type="text"
                  id="languagePreference.secondaryLanguage"
                  name="languagePreference.secondaryLanguage"
                  value={formData.languagePreference.secondaryLanguage}
                  onChange={handleChange}
                  placeholder="مثال: الإنجليزية"
                  className="w-full border border-gray-300 rounded p-2"
                  aria-describedby="secondaryLanguageHelp"
                />
                <p id="secondaryLanguageHelp" className="text-sm text-gray-500 mt-1">
                  أدخل اللغة الثانوية إن وجدت
                </p>
              </div>

              {/* Health Status */}
              <div>
                <label className="block font-semibold mb-1">هل تم تطعيم الطفل؟</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="healthStatus.vaccinated"
                      value="true"
                      checked={formData.healthStatus.vaccinated === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          healthStatus: { ...prev.healthStatus, vaccinated: true },
                        }))
                      }
                      className="form-radio"
                      aria-label="تطعيم الطفل: نعم"
                    />
                    <span className="mr-2">نعم</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="healthStatus.vaccinated"
                      value="false"
                      checked={formData.healthStatus.vaccinated === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          healthStatus: { ...prev.healthStatus, vaccinated: false },
                        }))
                      }
                      className="form-radio"
                      aria-label="تطعيم الطفل: لا"
                    />
                    <span className="mr-2">لا</span>
                  </label>
                </div>
                <textarea
                  name="healthStatus.notes"
                  value={formData.healthStatus.notes}
                  onChange={handleChange}
                  placeholder="ملاحظات صحية إضافية"
                  className="w-full border border-gray-300 rounded p-2 mt-2"
                  aria-describedby="healthStatusHelp"
                />
                <p id="healthStatusHelp" className="text-sm text-gray-500 mt-1">
                  أدخل أي ملاحظات صحية إضافية إن وجدت
                </p>
              </div>

              {/* Zone with Autocomplete */}
              <div>
                <label htmlFor="zone" className="block font-semibold mb-1">
                  المنطقة
                </label>
                <Select
                  id="zone"
                  name="zone"
                  options={governorates}
                  value={governorates.find((option) => option.value === formData.zone) || null}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, zone: selected ? selected.value : "" }))
                  }
                  placeholder="اختر المنطقة"
                  className="w-full"
                  classNamePrefix="select"
                  isClearable
                  aria-describedby="zoneHelp"
                />
                <p id="zoneHelp" className="text-sm text-gray-500 mt-1">
                  اختر المنطقة أو اكتبها (سيتم ملؤها تلقائيًا من الرقم القومي إذا أدخلته)
                </p>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
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
        </form>
      </div>
    </div>
  );
}
