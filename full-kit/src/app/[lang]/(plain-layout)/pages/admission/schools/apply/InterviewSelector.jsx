// ✅ You need to add a UI to let the user select suitable interview time slots
// Here's how you can extend your component logic:

// 1. Create a new component for selecting multiple time slots
// 2. Let the user select a few dates and time ranges
// 3. Submit them alongside the selected schools

// Example: InterviewSlotSelector.jsx
'use client';

import { useState } from 'react';

export default function InterviewSlotSelector({ slots, setSlots }) {
  const handleAddSlot = () => {
    setSlots([...slots, { date: '', from: '', to: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...slots];
    if (field === 'date') updated[index].date = value;
    else updated[index][field] = value;
    setSlots(updated);
  };

  const handleRemoveSlot = (index) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-gray-700">اختر مواعيد المقابلة المناسبة</h4>
      {slots.map((slot, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-2 items-center">
          <input
            type="date"
            value={slot.date}
            onChange={(e) => handleChange(idx, 'date', e.target.value)}
            className="border rounded p-1"
          />
          <input
            type="time"
            value={slot.from}
            onChange={(e) => handleChange(idx, 'from', e.target.value)}
            className="border rounded p-1"
          />
          <input
            type="time"
            value={slot.to}
            onChange={(e) => handleChange(idx, 'to', e.target.value)}
            className="border rounded p-1"
          />
          <button
            type="button"
            onClick={() => handleRemoveSlot(idx)}
            className="text-red-500 text-xs ml-2"
          >
            حذف
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddSlot}
        className="text-blue-500 text-sm mt-2"
      >
        + أضف موعد آخر
      </button>
    </div>
  );
}
