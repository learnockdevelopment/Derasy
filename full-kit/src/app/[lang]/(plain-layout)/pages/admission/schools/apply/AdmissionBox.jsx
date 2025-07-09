'use client';
import { useState } from 'react';

export default function AdmissionBox({
  selectedSchools,
  onDrop,
  onRemove,
  interviewSlotsMap,
  updateSlotsForSchool,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const school = JSON.parse(e.dataTransfer.getData('school'));
    onDrop(school);
  };

  const handleRemove = (id) => {
    onRemove(id);
  };

  const handleSlotChange = (schoolId, index, field, value) => {
    const updated = [...(interviewSlotsMap[schoolId] || [])];
    if (!updated[index]) updated[index] = { date: '', timeRange: { from: '', to: '' } };
    if (field === 'date') {
      updated[index].date = value;
    } else {
      updated[index].timeRange = {
        ...updated[index].timeRange,
        [field]: value,
      };
    }
    updateSlotsForSchool(schoolId, updated);
  };

  const addSlot = (schoolId) => {
    const current = interviewSlotsMap[schoolId] || [];
    updateSlotsForSchool(schoolId, [...current, { date: '', timeRange: { from: '', to: '' } }]);
  };

  const removeSlot = (schoolId, index) => {
    const current = [...(interviewSlotsMap[schoolId] || [])];
    current.splice(index, 1);
    updateSlotsForSchool(schoolId, current);
  };

  return (
    <div
      className="border-2 border-dashed border-purple-400 p-6 rounded-xl h-full bg-purple-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="text-xl font-bold text-purple-800 mb-4">
        📥 المدارس المختارة للتقديم (بحد أقصى 3)
      </h2>

      {selectedSchools.length === 0 ? (
        <p className="text-gray-500">قم بسحب المدارس هنا</p>
      ) : (
        <ul className="space-y-4">
          {selectedSchools.map((s) => (
            <li key={s._id} className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-800 font-bold text-lg">{s.name}</p>
                  <p className="text-sm text-gray-600">
                    📍 {s.branches?.[0]?.zone || 'منطقة غير معروفة'} - {s.branches?.[0]?.governorate || ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    💰 رسوم التقديم: {s.admissionFee?.amount?.toLocaleString('ar-EG') || 'غير محددة'} جنيه
                  </p>
                  <p className="text-sm text-gray-500">
                    🏷️ النوع: {s.type === 'International' ? 'دولي' : s.type === 'Private' ? 'خاص' : s.type}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => handleRemove(s._id)}
                >
                  إزالة
                </button>
              </div>


            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
