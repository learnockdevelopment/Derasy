'use client';
import ChildCard from './ChildCard';

export default function ChildSelector({ children, selectedChildId, setSelectedChildId, searchQuery, setSearchQuery }) {
  const filtered = children.filter((c) =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-6">
      <label className="block mb-2 text-lg font-semibold text-purple-800">🔍 ابحث واختر الطفل:</label>
      <input
        type="text"
        placeholder="ابحث باسم الطفل..."
        className="w-full border p-2 rounded-lg mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-scroll scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 pb-2">
        <div className="flex space-x-4 w-max pr-4">
          {filtered.map((child) => (
            <ChildCard
              key={child._id}
              child={child}
              isSelected={child._id === selectedChildId}
              onClick={setSelectedChildId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
