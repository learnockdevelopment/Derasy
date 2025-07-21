'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function EditSchoolPage() {
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

    Swal.fire({ icon: 'success', title: 'تم تحديث بيانات المدرسة بنجاح' });

  } catch (err) {
    Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
  }
}


  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (!school) return null;

  return (
    <>
      <div className="max-w-3xl mx-auto mt-6 text-right">
        <button
          type="button"
          onClick={() => router.push(`/pages/admission/me/schools/${id}/pvc-id-generator`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          إعداد كارت الطالب
        </button>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl mx-auto mt-10 p-6 font-[Cairo]">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">تعديل بيانات المدرسة</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">اسم المدرسة</label>
          <input
            type="text"
            value={school.name || ''}
            onChange={(e) => setSchool({ ...school, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">نوع المدرسة</label>
          <select
            value={school.type || ''}
            onChange={(e) => setSchool({ ...school, type: e.target.value })}
            className="w-full p-2 border rounded"
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
          <label className="block mb-1 font-medium">رابط الموقع</label>
          <input
            type="text"
            value={school.website || ''}
            onChange={(e) => setSchool({ ...school, website: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">المصاريف (الحد الأدنى)</label>
          <input
            type="number"
            value={school.feesRange?.min || ''}
            onChange={(e) => setSchool({ ...school, feesRange: { ...school.feesRange, min: parseInt(e.target.value) } })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">المصاريف (الحد الأقصى)</label>
          <input
            type="number"
            value={school.feesRange?.max || ''}
            onChange={(e) => setSchool({ ...school, feesRange: { ...school.feesRange, max: parseInt(e.target.value) } })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            حفظ التعديلات
          </button>
        </div>
      </form>
    </>
  );
}