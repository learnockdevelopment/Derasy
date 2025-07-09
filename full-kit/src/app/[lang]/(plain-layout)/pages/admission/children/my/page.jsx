'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Baby,
  Calendar,
  GraduationCap,
  School,
  MapPin,
  Clock,
  User,
} from 'lucide-react';
import LoadingLottie from '@/components/lottie';
import Swal from 'sweetalert2';
import Link from 'next/link';

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
    <div className="max-w-7xl mx-auto p-6 font-[Cairo]">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-600 flex items-center justify-center gap-2">
        <Baby className="w-8 h-8" /> الأطفال المسجلين
      </h1>

      {children.length === 0 ? (
        <p className="text-center text-gray-600 text-lg flex justify-center items-center gap-2">
          <User className="w-5 h-5" /> لا يوجد أطفال مسجلين حاليًا.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
                    <Link
          key={child._id}
          href={`/pages/admission/children/my/${child._id}`}
          className="block hover:scale-[1.02] transition-transform"
        >

            <div
              key={child._id}
              className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 text-white group transition-transform hover:scale-[1.015]"
            >
              {/* Inner glass layer */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-xl z-0" />

              <div className="relative z-10 flex flex-col justify-between p-5 space-y-4 min-h-[300px]">
                <div className="text-center border-b border-white/30 pb-2">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <User className="w-6 h-6" /> {child.fullName}
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    {child.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </p>
                </div>

                <ul className="text-sm space-y-3 text-white">
                  <li className="flex items-center justify-between border-b border-white/10 pb-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> تاريخ الميلاد
                    </span>
                    <span>{new Date(child.birthDate).toLocaleDateString('ar-EG')}</span>
                  </li>

                  <li className="flex items-center justify-between border-b border-white/10 pb-1">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> الصف المرغوب
                    </span>
                    <span>{child.desiredGrade}</span>
                  </li>

                  {child.currentSchool && (
                    <li className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="flex items-center gap-2">
                        <School className="w-4 h-4" /> المدرسة الحالية
                      </span>
                      <span>{child.currentSchool}</span>
                    </li>
                  )}

                  {child.zone && (
                    <li className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> المنطقة
                      </span>
                      <span>{child.zone}</span>
                    </li>
                  )}

                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> التسجيل
                    </span>
                    <span>{new Date(child.createdAt).toLocaleDateString('ar-EG')}</span>
                  </li>
                </ul>
              </div>
            </div>
</Link>
          ))}
        </div>
      )}
    </div>
  );
}
