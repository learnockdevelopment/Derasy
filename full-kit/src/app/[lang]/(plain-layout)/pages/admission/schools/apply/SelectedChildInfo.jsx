'use client';
import { User, Smile, Baby } from 'lucide-react';

export default function ChildCard({ child, isSelected, onClick }) {
  return (
    <div className="transition-all duration-500 ease-in-out mb-10 p-6 bg-white border rounded-xl shadow max-w-3xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${child.gender === 'male'
              ? 'bg-blue-500'
              : child.gender === 'female'
                ? 'bg-pink-500'
                : 'bg-gray-500'
            }`}
        >
          {child.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">{child.fullName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            {/* البيانات الأساسية */}
            <div><span className="font-semibold text-purple-600">الجنس:</span> {child.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
            <div><span className="font-semibold text-purple-600">تاريخ الميلاد:</span> {new Date(child.birthDate).toLocaleDateString()}</div>
            <div><span className="font-semibold text-purple-600">الرقم القومي:</span> {child.nationalId}</div>
            <div><span className="font-semibold text-purple-600">الديانة:</span> {child.religion}</div>
            <div><span className="font-semibold text-purple-600">الموقع:</span> {child.zone}</div>
            <div><span className="font-semibold text-purple-600">الصف الحالي:</span> {child.currentGrade}</div>
            <div><span className="font-semibold text-purple-600">المدرسة الحالية:</span> {child.currentSchool}</div>
            <div><span className="font-semibold text-purple-600">الصف المطلوب:</span> {child.desiredGrade}</div>

            {/* الاحتياجات الخاصة */}
            <div><span className="font-semibold text-purple-600">احتياجات خاصة:</span> {child.specialNeeds?.hasNeeds ? 'نعم' : 'لا'}</div>
            {child.specialNeeds?.hasNeeds && (
              <div><span className="font-semibold text-purple-600">تفاصيل:</span> {child.specialNeeds?.description || 'غير محددة'}</div>
            )}

            {/* الحالة الصحية */}
            <div><span className="font-semibold text-purple-600">مطعم:</span> {child.healthStatus?.vaccinated ? 'نعم' : 'لا'}</div>
            {child.healthStatus?.notes && (
              <div><span className="font-semibold text-purple-600">ملاحظات صحية:</span> {child.healthStatus?.notes}</div>
            )}

            {/* اللغات */}
            <div><span className="font-semibold text-purple-600">اللغة الأساسية:</span> {child.languagePreference?.primaryLanguage}</div>
            <div><span className="font-semibold text-purple-600">اللغة الثانوية:</span> {child.languagePreference?.secondaryLanguage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
