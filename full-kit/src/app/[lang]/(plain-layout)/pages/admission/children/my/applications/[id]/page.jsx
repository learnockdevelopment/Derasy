'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, School, Calendar, User2, Wallet, BadgeCheck, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ApplicationDetailsPage() {
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
        console.log(data);
        if (!res.ok) throw new Error(data.message || 'فشل تحميل بيانات الطلب');

        setApp(data);
      } catch (err) {
        console.log(err);
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
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
    <div className="max-w-4xl mx-auto p-6 mt-10 font-[Cairo] text-right">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-700">
          <FileText className="w-6 h-6" />
          تفاصيل الطلب
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailCard
            icon={<School className="text-purple-600 w-5 h-5" />}
            label="اسم المدرسة"
            value={app.school?.name || 'غير معروف'}
          />
          <DetailCard
            icon={<User2 className="text-blue-600 w-5 h-5" />}
            label="اسم الطفل"
            value={app.child?.fullName || 'غير معروف'}
          />
          <DetailCard
            icon={<Calendar className="text-gray-600 w-5 h-5" />}
            label="تاريخ التقديم"
            value={new Date(app.submittedAt).toLocaleDateString('ar-EG')}
          />
          <DetailCard
            icon={<Wallet className="text-yellow-500 w-5 h-5" />}
            label="رسوم التقديم"
            value={
              app.school?.admissionFee?.amount?.toLocaleString('ar-EG') + ' EGP' || 'غير محدد'
            }
          />
          <DetailCard
            icon={<BadgeCheck className="text-green-500 w-5 h-5" />}
            label="الحالة"
            value={statusLabels[app.status] || 'غير معروف'}
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-4 flex items-start gap-4 shadow-sm">
      <div className="p-2 bg-white rounded-full shadow">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
