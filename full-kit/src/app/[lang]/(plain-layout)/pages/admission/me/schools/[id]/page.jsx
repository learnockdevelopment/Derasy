'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useUser } from "@/contexts/user-context";
import { Sparkles, Pencil, School as SchoolIcon } from 'lucide-react';

export default function SchoolProfilePage() {
  const user = useUser();
  const router = useRouter();
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchSchool() {
      try {
        const res = await fetch(`/api/schools/my/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSchool(data.school);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [id]);

  if (loading) return <div className="text-center mt-10 font-[Cairo]">⏳ جاري تحميل المدرسة...</div>;
  if (!school) return null;

  return (
    <div className="container mx-auto px-4 py-6 font-[Cairo]">
      {/* Banner */}
      <div className="relative h-52 rounded-3xl overflow-hidden shadow-xl mb-8">
        <img
          src={school.image || '/school-fun-banner.jpg'}
          alt="School Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-300  backdrop-blur-sm flex items-end justify-between p-6 text-white rounded-3xl">
          <div>
            <h1 className="text-3xl font-bold drop-shadow">{school.name}</h1>
            <p className="text-sm">{school.type === 'Private' ? '🏫 مدرسة خاصة' : school.type === 'International' ? '🌍 مدرسة دولية' : '🏫 مدرسة حكومية'}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/pages/admission/me/schools/${id}/edit`)}
              className="border border-white text-white px-4 py-2 rounded-full bg-blue-400 hover:bg-white hover:text-blue-600 flex items-center gap-2 transition-all"
            >
              <Pencil size={18} />
              تعديل
            </button>
            <button
              onClick={() => router.push(`/pages/admission/me/schools/${id}/pvc-id-generator`)}
              className="bg-yellow-400 text-shadow-lg text-white px-4 py-2 rounded-full hover:bg-yellow-500 flex items-center gap-2 transition-all"
            >
              <Sparkles size={18} />
              إعداد كارت الطالب
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6  mx-auto border-4 border-dotted border-pink-200">

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-purple-800">
          <Info label="النوع" value={school.type} />
          <Info label="الديانة" value={school.isReligious ? (school.religionType === 'Muslim' ? '🕌 إسلامية' : '✝️ أخرى') : '❌ غير دينية'} />
          <Info label="مصاريف الحد الأدنى" value={`${school.feesRange?.min?.toLocaleString()} جنيه`} />
          <Info label="مصاريف الحد الأقصى" value={`${school.feesRange?.max?.toLocaleString()} جنيه`} />
          <Info label="القبول مفتوح؟" value={school.admissionOpen ? '✅ نعم' : '❌ لا'} />
          <Info label="رسوم التقديم" value={`${school.admissionFee?.amount?.toLocaleString()} ${school.admissionFee?.currency}`} />
          <Info label="الموقع" value={<a href={school.website} target="_blank" className="text-blue-500 underline">{school.website}</a>} />
          <Info label="اللغات المتاحة" value={school.languages?.join('، ')} />
          <Info label="المراحل الدراسية" value={school.gradesOffered?.join('، ')} />
          <Info label="احتياجات خاصة" value={school.supportsSpecialNeeds ? '✅ نعم' : '❌ لا'} />
        </div>

        {/* Documents */}
        {school.documentsRequired?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-bold text-pink-600 mb-2 flex items-center gap-2">
              📋 المستندات المطلوبة:
            </h3>
            <div className="flex flex-wrap gap-2">
              {school.documentsRequired.map((doc, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full shadow text-sm font-medium border border-yellow-300 flex items-center gap-1"
                >
                  📌 {doc}
                </span>
              ))}
            </div>
          </div>
        )}


        {/* Branches */}
        <div className="mt-6">
          <h3 className="text-md font-bold text-pink-600 mb-2">🏫 فروع المدرسة:</h3>
          {school.branches?.map((branch, idx) => (
            <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm mb-3">
              <p><strong>📍 الاسم:</strong> {branch.name}</p>
              <p><strong>🗺️ المحافظة:</strong> {branch.governorate}</p>
              <p><strong>📌 المنطقة:</strong> {branch.zone}</p>
              <p><strong>🏠 العنوان:</strong> {branch.address}</p>
              <p><strong>📧 البريد:</strong> {branch.contactEmail}</p>
              <p><strong>📞 الهاتف:</strong> {branch.contactPhone}</p>
              <p><strong>🛝 المرافق:</strong> {branch.facilities?.join('، ')}</p>
            </div>
          ))}
        </div>

        {/* Owner */}
        <div className="mt-6">
          <h3 className="text-md font-bold text-pink-600 mb-2">👨‍🏫 مالك المدرسة:</h3>
          {school.ownership?.owner ? (
            <div className="text-gray-800 space-y-1">
              <p>🧑‍💼 الاسم: {school.ownership.owner.name}</p>
              <p>✉️ البريد الإلكتروني: {school.ownership.owner.email}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">لا توجد معلومات عن المالك حاليًا.</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-md font-bold text-blue-600 mb-2">🛡️ المشرفون على المدرسة:</h3>
          {school.moderators && school.moderators.length > 0 ? (
            <ul className="space-y-2 text-gray-800 list-disc list-inside">
              {school.moderators.map((mod, idx) => (
                <li key={idx} className="ml-2">
                  👤 {mod.fullName} — ✉️ {mod.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">لا يوجد مشرفون مضافون بعد.</p>
          )}
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-semibold">{value || 'غير متوفر'}</p>
    </div>
  );
}
