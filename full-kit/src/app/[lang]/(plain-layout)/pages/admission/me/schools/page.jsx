'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  School,
  MapPin,
  Globe,
  Phone,
  ExternalLink,
  Building2,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function MySchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const res = await fetch('/api/schools/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'فشل تحميل المدارس');

        setSchools(data.schools || []);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  if (loading) {
  return (
    <div className="flex flex-col gap-4 h-64 justify-center items-center w-full max-w-md mx-auto">
      <div className="w-full h-6 rounded-md bg-gray-200 animate-pulse" />
      <div className="w-full h-4 rounded-md bg-gray-200 animate-pulse" />
      <div className="w-3/4 h-4 rounded-md bg-gray-200 animate-pulse" />
    </div>
  );
}



  return (
    <div className="max-w-7xl mx-auto p-6 font-[Cairo]">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700 flex items-center justify-center gap-2">
        <School className="w-7 h-7" /> المدارس التي أمتلكها
      </h1>

      {schools.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">لا توجد مدارس مسجلة باسمك.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school._id}
              className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white group transition-transform hover:scale-[1.015]"
            >
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-xl z-0" />
              <div className="relative z-10 p-5 space-y-4 min-h-[280px] flex flex-col justify-between">
                <div className="border-b border-white/30 pb-2 text-center">
                  <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                    <Building2 className="w-6 h-6" /> {school.name}
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    🏷️ {school.type === 'International' ? 'دولي' : school.type === 'Private' ? 'خاص' : school.type}
                  </p>
                </div>

                <ul className="text-sm space-y-3 text-white">
                  {school.branches?.[0] && (
                    <li className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> المنطقة
                      </span>
                      <span>{school.branches[0].zone} - {school.branches[0].governorate}</span>
                    </li>
                  )}

                  {school.branches?.[0]?.contactPhone && (
                    <li className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> الهاتف
                      </span>
                      <span>{school.branches[0].contactPhone}</span>
                    </li>
                  )}

                  {school.website && (
                    <li className="flex items-center justify-between border-b border-white/10 pb-1">
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> الموقع الإلكتروني
                      </span>
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline flex items-center gap-1"
                      >
                        زيارة <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  )}

                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      💰 الرسوم
                    </span>
                    <span>
                      {school.feesRange?.min?.toLocaleString('ar-EG')} -{' '}
                      {school.feesRange?.max?.toLocaleString('ar-EG')} EGP
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
