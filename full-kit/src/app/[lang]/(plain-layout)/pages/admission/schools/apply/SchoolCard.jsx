'use client';

export default function SchoolCard({ school, onDragStart, suggested = false }) {
  return (
    <div
      className={`relative p-4 border rounded-lg cursor-pointer transition hover:shadow-lg ${
        suggested
          ? 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100 border-yellow-400 shadow-yellow-300'
          : 'bg-white shadow'
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('school', JSON.stringify(school));
        if (onDragStart) onDragStart(school);
      }}
    >
      {suggested && (
        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white px-2 py-0.5 text-xs rounded shadow z-10 font-semibold">
          🏅 موصى بها من دراسي
        </div>
      )}

      <h3
        className={`text-lg mb-2 font-bold ${
          suggested ? 'text-yellow-700' : 'text-purple-700'
        }`}
      >
        {school.name}
      </h3>

      <p className={`text-sm ${suggested ? 'text-yellow-800' : 'text-gray-600'}`}>
        المصروفات: {school.admissionFee?.amount?.toLocaleString('ar-EG') || 0} جنيه
      </p>
    </div>
  );
}
