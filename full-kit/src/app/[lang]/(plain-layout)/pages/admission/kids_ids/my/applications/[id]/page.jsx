'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PrintableApplicationPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/application/${id}`, {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split('; ')
              .find((row) => row.startsWith('token='))
              ?.split('=')[1] || ''}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'فشل تحميل بيانات الطلب');
        setApp(data);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
  }

  if (!app) {
    return <div className="text-center text-red-500 mt-10">تعذر تحميل بيانات الطلب.</div>;
  }

  const statusLabels = {
    pending: 'قيد الانتظار',
    under_review: 'قيد المراجعة',
    recommended: 'موصى بها',
    accepted: 'تم القبول',
    rejected: 'مرفوضة',
    draft: 'مسودة',
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-[Cairo] text-right bg-white print:p-4 print:bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📄 نموذج تقديم المدرسة</h1>
        <button
          onClick={printPage}
          className="bg-purple-600 text-white px-4 py-2 rounded print:hidden"
        >
          🖨️ طباعة
        </button>
      </div>

      {/* بيانات المدرسة */}
      <section className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2 text-purple-700">📚 بيانات المدرسة</h2>
        <p><strong>الاسم:</strong> {app.school?.name}</p>
        <p><strong>النوع:</strong> {app.school?.type}</p>
        <p><strong>الديانة:</strong> {app.school?.religionType || 'غير محدد'}</p>
        <p><strong>اللغات:</strong> {app.school?.languages?.join(' - ')}</p>
        <p><strong>الفرع:</strong> {app.school?.branches?.[0]?.zone}, {app.school?.branches?.[0]?.governorate}</p>
        <p><strong>العنوان:</strong> {app.school?.branches?.[0]?.address}</p>
        <p><strong>رسوم التقديم:</strong> {app.school?.admissionFee?.amount?.toLocaleString('ar-EG')} EGP</p>
        <p><strong>نطاق المصروفات:</strong> {app.school?.feesRange?.min?.toLocaleString('ar-EG')} - {app.school?.feesRange?.max?.toLocaleString('ar-EG')} EGP</p>
        <p><strong>الموقع الإلكتروني:</strong> {app.school?.website}</p>
      </section>

      {/* بيانات الطفل */}
      <section className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2 text-blue-700">👶 بيانات الطفل</h2>
        <p><strong>الاسم:</strong> {app.child?.fullName}</p>
        <p><strong>النوع:</strong> {app.child?.gender === 'female' ? 'أنثى' : 'ذكر'}</p>
        <p><strong>تاريخ الميلاد:</strong> {new Date(app.child?.birthDate).toLocaleDateString('ar-EG')}</p>
        <p><strong>الرقم القومي:</strong> {app.child?.nationalId}</p>
        <p><strong>الصف الحالي:</strong> {app.child?.currentSchool} - {app.child?.currentGrade}</p>
        <p><strong>الصف المرغوب:</strong> {app.child?.desiredGrade}</p>
        <p><strong>المنطقة:</strong> {app.child?.zone}</p>
        <p><strong>الديانة:</strong> {app.child?.religion}</p>
        <p><strong>الحالة الصحية:</strong> {app.child?.healthStatus?.vaccinated ? 'مطعّم' : 'غير مطعّم'}</p>
        <p><strong>اللغة الأساسية:</strong> {app.child?.languagePreference?.primaryLanguage}</p>
        <p><strong>اللغة الثانوية:</strong> {app.child?.languagePreference?.secondaryLanguage}</p>
        <p><strong>احتياجات خاصة:</strong> {app.child?.specialNeeds?.hasNeeds ? 'نعم' : 'لا'}</p>
      </section>

      {/* بيانات التقديم */}
      <section className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2 text-green-700">📝 بيانات الطلب</h2>
        <p><strong>الحالة:</strong> {statusLabels[app.status]}</p>
        <p><strong>تاريخ التقديم:</strong> {new Date(app.submittedAt).toLocaleDateString('ar-EG')}</p>
        {app.payment?.isPaid && (
          <p><strong>الدفع:</strong> تم الدفع - {app.payment.amount?.toLocaleString('ar-EG')} EGP</p>
        )}
      </section>
      {app.preferredInterviewSlots?.length > 0 && (
        <section className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-bold mb-2 text-indigo-700">🕓 المواعيد المقترحة للمقابلة</h2>
          <ul className="list-disc pr-5 space-y-1 text-sm text-gray-800">
            {app.preferredInterviewSlots.map((slot, index) => (
              <li key={index}>
                <span className="font-semibold">📅 {new Date(slot.date).toLocaleDateString('ar-EG')}</span> —
                <span className="mx-1">🕒 من {slot.timeRange.from} إلى {slot.timeRange.to}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* الوثائق (اختياري) */}
      {app.child?.documents?.length > 0 && (
        <section className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-bold mb-2 text-gray-700">📎 الوثائق المرفقة</h2>
          <ul className="list-disc pr-5">
            {app.child.documents.map((doc, idx) => (
              <li key={idx}>{doc}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
