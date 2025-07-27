'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useUser } from "@/contexts/user-context"

export default function EditSchoolPage() {
  const user = useUser();
  const cookieString = document.cookie;
  const token = cookieString
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

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

  async function handleSave(e) {
    e.preventDefault();

    try {
      if (!token) throw new Error('Authentication token not found in cookies');

      const res = await fetch(`/api/schools/my/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(school),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({ icon: 'success', title: '🎉 تم حفظ التعديلات بنجاح!' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
    }
  }

  if (loading) return <div className="text-center mt-10">🌀 جاري التحميل...</div>;
  if (!school) return null;

  return (
    <div className="container mx-auto p-6 font-[Cairo] bg-yellow-50 rounded-xl shadow-xl">
      <form onSubmit={handleSave} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg font-[Cairo]">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">🎨 تعديل بيانات المدرسة</h1>

        <div className="mb-4">
          <label className="block mb-1 font-bold text-lg">🏫 اسم المدرسة</label>
          <input
            type="text"
            value={school.name || ''}
            onChange={(e) => setSchool({ ...school, name: e.target.value })}
            className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold text-lg">🏷️ نوع المدرسة</label>
          <select
            value={school.type || ''}
            onChange={(e) => setSchool({ ...school, type: e.target.value })}
            className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">اختر النوع</option>
            <option value="Public">حكومية</option>
            <option value="Private">خاصة</option>
            <option value="International">دولية</option>
            <option value="National">قومية</option>
            <option value="Experimental">تجريبية</option>
            <option value="Language">لغات</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold text-lg">🌐 رابط الموقع الإلكتروني</label>
          <input
            type="text"
            value={school.website || ''}
            onChange={(e) => setSchool({ ...school, website: e.target.value })}
            className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-1 font-bold text-lg">💰 الحد الأدنى للمصاريف</label>
            <input
              type="number"
              value={school.feesRange?.min || ''}
              onChange={(e) => setSchool({ ...school, feesRange: { ...school.feesRange, min: parseInt(e.target.value) } })}
              className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-bold text-lg">💵 الحد الأقصى للمصاريف</label>
            <input
              type="number"
              value={school.feesRange?.max || ''}
              onChange={(e) => setSchool({ ...school, feesRange: { ...school.feesRange, max: parseInt(e.target.value) } })}
              className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold text-lg">📋 المستندات المطلوبة</label>
          <textarea
            rows={4}
            value={school.documentsRequired?.join('\n') || ''}
            onChange={(e) => setSchool({ ...school, documentsRequired: e.target.value.split('\n') })}
            className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-bold text-lg">👨‍🏫 مالك المدرسة</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="الاسم"
              value={school.ownership?.owner?.name || ''}
              onChange={(e) => setSchool({
                ...school,
                ownership: {
                  ...school.ownership,
                  owner: { ...school.ownership?.owner, name: e.target.value },
                },
              })}
              className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={school.ownership?.owner?.email || ''}
              onChange={(e) => setSchool({
                ...school,
                ownership: {
                  ...school.ownership,
                  owner: { ...school.ownership?.owner, email: e.target.value },
                },
              })}
              className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-bold text-lg">🆔 أرقام الهوية الوطنية الموثوقة</label>

          {school.trustedIds?.map((id, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={id}
                onChange={(e) => {
                  const updatedIds = [...school.trustedIds];
                  updatedIds[index] = e.target.value;
                  setSchool({ ...school, trustedIds: updatedIds });
                }}
                className="flex-1 p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedIds = school.trustedIds.filter((_, i) => i !== index);
                  setSchool({ ...school, trustedIds: updatedIds });
                }}
                className="text-red-500 hover:text-red-700 text-xl font-bold"
                title="حذف"
              >
                🗑
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setSchool({
                ...school,
                trustedIds: [...(school.trustedIds || []), '']
              })
            }
            className="mt-2 text-sm text-purple-700 hover:underline"
          >
            ➕ إضافة رقم هوية جديد
          </button>
        </div>



        <div className="mb-6">
          <label className="block mb-1 font-bold text-lg">🛡️ المشرفون (أسماء + إيميلات)</label>
          <textarea
            rows={4}
            value={school.moderators?.map(mod => `${mod.fullName} <${mod.email}>`).join('\n') || ''}
            onChange={(e) => {
              const lines = e.target.value.split('\n').map(line => {
                const match = line.match(/^(.*?)\s*<(.+?)>$/);
                return match ? { fullName: match[1], email: match[2] } : null;
              }).filter(Boolean);
              setSchool({ ...school, moderators: lines });
            }}
            className="w-full p-3 border rounded-lg border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-purple-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-purple-700 shadow-md transition"
          >
            💾 حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
