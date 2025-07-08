'use client';

export default function SchoolCard({ school, onDragStart }) {
  return (
    <div
      className="bg-white p-4 border shadow rounded-lg cursor-pointer hover:shadow-lg transition"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('school', JSON.stringify(school));
        if (onDragStart) onDragStart(school);
      }}
    >
      <h3 className="text-lg font-bold text-purple-700 mb-2">{school.name}</h3>
      <p className="text-gray-600">
        المصروفات: {school.admissionFee?.amount?.toLocaleString() || 0} EGP
      </p>
    </div>
  );
}
