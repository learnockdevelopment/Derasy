'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ParentChildrenPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChildren() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const res = await fetch('/api/children/get-related', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'فشل تحميل بيانات الأطفال');
        }

        setChildren(data.children || []);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-tr from-pink-50 via-purple-50 to-blue-50 rounded-xl shadow-xl mt-8 font-[Cairo]">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">👶 الأطفال المسجلين</h1>

      {children.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">🚫 لا يوجد أطفال مسجلين حاليًا.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div
              key={child._id}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">🎒 {child.fullName}</h2>
              <ul className="space-y-2 text-right text-gray-700">
                <li>
                  <span className="font-semibold text-purple-600">👦 الجنس:</span>{' '}
                  {child.gender === 'male' ? 'ذكر' : 'أنثى'}
                </li>
                <li>
                  <span className="font-semibold text-purple-600">🎂 تاريخ الميلاد:</span>{' '}
                  {new Date(child.birthDate).toLocaleDateString('ar-EG')}
                </li>
                <li>
                  <span className="font-semibold text-purple-600">📚 الصف المرغوب:</span>{' '}
                  {child.desiredGrade}
                </li>
                {child.currentSchool && (
                  <li>
                    <span className="font-semibold text-purple-600">🏫 المدرسة الحالية:</span>{' '}
                    {child.currentSchool}
                  </li>
                )}
                {child.zone && (
                  <li>
                    <span className="font-semibold text-purple-600">📍 المنطقة:</span>{' '}
                    {child.zone}
                  </li>
                )}
                <li>
                  <span className="font-semibold text-purple-600">🕒 تاريخ التسجيل:</span>{' '}
                  {new Date(child.createdAt).toLocaleDateString('ar-EG')}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
