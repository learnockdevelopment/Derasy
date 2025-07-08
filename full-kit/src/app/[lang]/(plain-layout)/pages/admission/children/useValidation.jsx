import { useCallback } from "react";
import debounce from "lodash/debounce";

export default function useValidation(setFormData, setErrors) {
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

  const extractFromNationalId = (id) => {
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

  const validateStep = (fields, formData) => {
    const stepErrors = {};
    fields.forEach((field) => {
      if (field === "fullName") stepErrors.fullName = validateFullName(formData.fullName);
      if (field === "nationalId") stepErrors.nationalId = validateNationalId(formData.nationalId);
      if (field === "gender" && !formData.gender) stepErrors.gender = "الرجاء اختيار الجنس";
      if (field === "birthDate" && !formData.birthDate) stepErrors.birthDate = "الرجاء إدخال تاريخ الميلاد";
      if (field === "desiredGrade" && !formData.desiredGrade) stepErrors.desiredGrade = "الرجاء إدخال الصف المرغوب";
    });
    return stepErrors;
  };

  return { validateField, validateStep, debouncedExtractFromNationalId };
}