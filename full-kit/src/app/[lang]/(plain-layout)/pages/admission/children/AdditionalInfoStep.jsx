export default function AdditionalInfoStep({ formData, errors, handleChange }) {
  return (
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
              onChange={handleChange}
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
              onChange={handleChange}
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
  );
}