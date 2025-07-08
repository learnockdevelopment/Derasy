'use client';
import { User, Smile, Baby } from 'lucide-react';

export default function ChildCard({ child, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(child._id)}
      className={`group min-w-[180px] max-w-[180px] cursor-pointer p-4 border rounded-2xl shadow-sm text-center transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-500 shadow-md'
          : 'bg-white hover:shadow-lg'
      }`}
    >
      <div
        className={`w-16 h-16 mx-auto rounded-full text-white font-bold text-xl flex items-center justify-center mb-2 shadow-inner ${
          child.gender === 'male'
            ? 'bg-blue-500'
            : child.gender === 'female'
            ? 'bg-pink-500'
            : 'bg-gray-400'
        }`}
      >
        {child.gender === 'male' ? (
          <User className="w-6 h-6" />
        ) : child.gender === 'female' ? (
          <Smile className="w-6 h-6" />
        ) : (
          <Baby className="w-6 h-6" />
        )}
      </div>

      <h4 className="text-md font-bold text-purple-800 mb-1 line-clamp-1">{child.fullName}</h4>
      <div className="mt-2 h-5 text-xs font-semibold text-purple-600 text-center">
        {isSelected ? <span className="animate-pulse">✅ مختار</span> : <span>&nbsp;</span>}
      </div>
    </div>
  );
}
