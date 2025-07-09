'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export default function ChildProfilePage() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChild() {
      try {
        const res = await fetch(`/api/children/get-related/${id}`, {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split('; ')
              .find((row) => row.startsWith('token='))
              ?.split('=')[1] || ''}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'فشل تحميل بيانات الطفل');
        setChild(data.child);
      } catch (err) {
        toast({
          title: 'حدث خطأ',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchChild();
  }, [id]);

  if (loading) return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
  if (!child) return <div className="text-center text-red-500 mt-10">تعذر تحميل بيانات الطفل.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 font-[Cairo] text-right bg-white print:p-4 print:bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">👶 بيانات الطفل</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded print:hidden"
        >
          🖨️ طباعة
        </button>
      </div>

      {child.profileImage?.url && (
        <div className="mb-4 flex justify-center">
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById('profileUploadInput')?.click()}
          >
            <img
              src={child.profileImage.url}
              alt="صورة الطفل"
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-300 shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
              <span className="text-white text-xl">📷</span>
            </div>

            <input
              id="profileUploadInput"
              type="file"
              accept="image/*,application/pdf"

              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'profile');

                try {
                  const res = await fetch(`/api/children/get-related/${id}/upload`, {
                    method: 'PUT',
                    headers: {
                      Authorization: `Bearer ${document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('token='))
                        ?.split('=')[1] || ''}`,
                    },
                    body: formData,
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message);

                  setChild(data.child);
                  toast({
                    title: 'تم تحديث الصورة',
                    description: 'تم رفع صورة الطفل بنجاح.',
                    variant: 'success',
                  });
                } catch (err) {
                  toast({
                    title: 'خطأ',
                    description: err.message,
                    variant: 'destructive',
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      <section className="border p-4 rounded mt-6">
        <h2 className="text-lg font-bold text-indigo-700 mb-2">📤 رفع وثيقة أو صورة</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target;
            const fileInput = form.elements.file;
            const labelInput = form.elements.label;
            const typeInput = form.elements.type;

            const file = fileInput.files[0];
            if (!file) {
              toast({
                title: 'يرجى اختيار ملف',
                description: 'لم يتم تحديد أي ملف.',
                variant: 'destructive',
              });
              return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('label', labelInput.value);
            formData.append('type', typeInput.value);

            try {
              const res = await fetch(`/api/children/get-related/${id}/upload`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
                    ?.split('=')[1] || ''}`,
                },
                body: formData,
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.message);

              setChild(data.child);
              toast({
                title: 'تم رفع الوثيقة',
                description: 'تم حفظ الوثيقة في سجل الطفل.',
                variant: 'success',
              });
              form.reset();
            } catch (err) {
              toast({
                title: 'خطأ أثناء رفع الملف',
                description: err.message,
                variant: 'destructive',
              });
            }
          }}
          className="space-y-3"
        >
          <input name="file" type="file" accept="image/*,application/pdf" className="block w-full border p-2 rounded" />
          <input
            name="label"
            type="text"
            placeholder="اسم الوثيقة (اختياري)"
            className="block w-full border p-2 rounded"
          />
          <select name="type" className="block w-full border p-2 rounded">
            <option value="document">وثيقة</option>
            <option value="profile">صورة شخصية</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            رفع
          </button>
        </form>
      </section>

      <section className="border p-4 rounded space-y-2 mt-6">
        <p><strong>الاسم:</strong> {child.fullName}</p>
        <p><strong>النوع:</strong> {child.gender === 'female' ? 'أنثى' : 'ذكر'}</p>
        <p><strong>تاريخ الميلاد:</strong> {new Date(child.birthDate).toLocaleDateString('ar-EG')}</p>
        <p><strong>الرقم القومي:</strong> {child.nationalId}</p>
        <p><strong>الصف الحالي:</strong> {child.currentSchool} - {child.currentGrade}</p>
        <p><strong>الصف المرغوب:</strong> {child.desiredGrade}</p>
        <p><strong>المنطقة:</strong> {child.zone}</p>
        <p><strong>الديانة:</strong> {child.religion}</p>
        <p><strong>الحالة الصحية:</strong> {child.healthStatus?.vaccinated ? 'مطعّم' : 'غير مطعّم'}</p>
        <p><strong>اللغة الأساسية:</strong> {child.languagePreference?.primaryLanguage}</p>
        <p><strong>اللغة الثانوية:</strong> {child.languagePreference?.secondaryLanguage}</p>
        <p><strong>احتياجات خاصة:</strong> {child.specialNeeds?.hasNeeds ? 'نعم' : 'لا'}</p>

        {child.documents?.length > 0 && (
          <div>
            <h3 className="font-semibold mt-4 mb-2">📎 الوثائق المرفقة:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {child.documents.map((doc, idx) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
                const isPdf = /\.pdf$/i.test(doc.url);

                return (
                  <div key={idx} className="border p-2 rounded shadow-sm">
                    <p className="font-medium mb-2">{doc.label || `وثيقة #${idx + 1}`}</p>
                    {isImage && (
                      <img
                        src={doc.url}
                        alt={doc.label || `وثيقة #${idx + 1}`}
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    {isPdf && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        عرض الملف 📄
                      </a>
                      // Or use embed:
                      // <embed src={doc.url} type="application/pdf" width="100%" height="300px" />
                    )}
                    {!isImage && !isPdf && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        تحميل الملف
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
