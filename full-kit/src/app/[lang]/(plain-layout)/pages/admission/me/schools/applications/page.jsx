'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  FileText,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ReceivedApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const statusLabels = {
    pending: 'قيد الانتظار',
    under_review: 'قيد المراجعة',
    recommended: 'موصى بها',
    accepted: 'تم القبول',
    rejected: 'مرفوضة',
  };

  const statusColors = {
    pending: 'text-gray-500',
    under_review: 'text-blue-500',
    recommended: 'text-purple-600',
    accepted: 'text-green-600',
    rejected: 'text-red-600',
  };

  useEffect(() => {
    async function fetchApplications() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const res = await fetch('/api/me/applications/school/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'فشل تحميل الطلبات');

        setApplications(data.applications || []);
      } catch (err) {
        toast({ title: 'خطأ', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
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
    <div className="max-w-4xl mx-auto p-6 mt-10 font-[Cairo]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-right">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            الطلبات المستلمة
          </h2>
        </div>

        {applications.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد طلبات مستلمة حالياً.</p>
        ) : (
          <ul className="space-y-5">
            {applications.map((app) => (
              <li
                key={app._id}
                className="bg-gray-50 p-4 rounded-xl border shadow-sm hover:bg-gray-100 transition"
              >
                <Link href={`/pages/admission/me/schools/applications/${app._id}`} passHref>
                  <div className="flex flex-col md:flex-row justify-between gap-3 cursor-pointer">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        🏫 {app.school?.name || 'مدرسة غير معروفة'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        👶 الطفل: <span className="font-semibold">{app.child?.fullName}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        📅 التقديم: {new Date(app.submittedAt).toLocaleDateString('ar-EG')}
                      </p>

                      {app.preferredInterviewSlots?.length > 0 && (
                        <div className="mt-2 space-y-1 text-sm text-purple-700 bg-purple-50 border border-purple-200 p-2 rounded-md">
                          <p className="font-semibold">🕓 مواعيد المقابلة المقترحة:</p>
                          {app.preferredInterviewSlots.map((slot, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span>📅 {new Date(slot.date).toLocaleDateString('ar-EG')}</span>
                              <span>🕒 من {slot.timeRange.from}</span>
                              <span>إلى {slot.timeRange.to}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <span className={`font-bold ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                      {app.payment?.isPaid && (
                        <span className="text-green-600 text-sm mt-1">💰 تم الدفع</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
