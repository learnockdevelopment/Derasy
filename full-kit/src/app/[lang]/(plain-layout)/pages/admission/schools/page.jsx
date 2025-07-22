'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SchoolsListPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch('/api/schools/view');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'فشل تحميل بيانات المدارس');
        }

        setSchools(data.schools || []);
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

    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-xl mt-8 font-[Cairo] text-right">
      
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">🏫 المدارس المتاحة</h1>

      {schools.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">🚫 لا توجد مدارس متاحة حاليًا.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school._id}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl font-bold mb-4 text-pink-700 text-center">🎓 {school.name}</h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-semibold text-purple-600">📂 النوع:</span> {school.type}
                </li>
                <li>
                  <span className="font-semibold text-purple-600">🌐 اللغات:</span> {school.languages?.join('، ')}
                </li>
                <li>
                  <span className="font-semibold text-purple-600">🧾 المصروفات:</span> {school.feesRange?.min?.toLocaleString()} - {school.feesRange?.max?.toLocaleString()} {school.admissionFee?.currency || 'EGP'}
                </li>
                <li>
                  <span className="font-semibold text-purple-600">⏳ التقديم مفتوح:</span>{' '}
                  {school.admissionOpen ? 'نعم' : 'لا'}
                </li>
                {school.branches?.[0]?.governorate && (
                  <li>
                    <span className="font-semibold text-purple-600">📍 المحافظة:</span>{' '}
                    {school.branches[0].governorate}
                  </li>
                )}
                {school.branches?.[0]?.zone && (
                  <li>
                    <span className="font-semibold text-purple-600">📌 المنطقة:</span>{' '}
                    {school.branches[0].zone}
                  </li>
                )}
                {school.website && (
                  <li>
                    <span className="font-semibold text-purple-600">🌍 الموقع الإلكتروني:</span>{' '}
                    <a href={school.website} target="_blank" className="text-blue-600 underline">
                      زيارة الموقع
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
