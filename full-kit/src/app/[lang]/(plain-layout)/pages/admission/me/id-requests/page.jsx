'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentCardRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [templateImage, setTemplateImage] = useState('');
  const [fieldsConfig, setFieldsConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchData() {
      try {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
        const token = match ? match[1] : null;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 🟢 الطلب الرئيسي للطلبات
        const [reqRes] = await Promise.all([
          fetch(`/api/schools/my/cards`, { headers }),
        ]);

        const reqData = await reqRes.json();

        if (!reqRes.ok) throw new Error(reqData.message);

        setRequests(reqData.requests || []);
        setFieldsConfig(reqData.fields || []);
        setTemplateImage(reqData?.school?.idCard?.url || '');
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">جاري تحميل الطلبات...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* 🟢 عرض الطلبات */}
      {requests.length === 0 ? (
        <p className="text-center text-gray-600">لا توجد طلبات حالياً</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req, idx) => (
            <Link
              href={`/pages/admission/me/schools/${req.school._id}/requests/${req._id}`}
              key={idx}
              className="block"
            >
              <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
                <div className="relative w-full h-[250px] border rounded overflow-hidden mb-4">
                  {req.school.idCard.url ? (
                    <Image
                      src={req.school.idCard.url || templateImage}
                      alt="بطاقة"
                      layout="fill"
                      objectFit="cover"
                      className="z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                      لا يوجد قالب
                    </div>
                  )}

                  {req.school.studentIdCardFields.map((field, i) => {
                    const style = field.style || {};
                    const submittedValue = req.fields?.find(f => f.key === field.key)?.value;

                    const commonStyle = {
                      position: 'absolute',
                      left: `${style.x || 0}px`,
                      top: `${style.y || 0}px`,
                      width: `${style.width || 100}px`,
                      height: `${style.height || 30}px`,
                      fontSize: `${style.fontSize || 14}px`,
                      fontWeight: style.fontWeight || 'normal',
                      color: style.color || '#000',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      textAlign: style.textAlign || 'center',
                      backgroundColor: 'transparent',
                      padding: '2px',
                      borderRadius: '4px',
                      zIndex: 10,
                      pointerEvents: 'none',
                    };

                    if (field.type === 'photo' && submittedValue?.startsWith('http')) {
                      return (
                        <img
                          key={i}
                          src={submittedValue}
                          alt={field.key}
                          style={{ ...commonStyle, objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                      );
                    }

                    return (
                      <div key={i} style={commonStyle}>
                        {submittedValue || '---'}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                      ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {req.status === 'approved'
                      ? 'تم القبول'
                      : req.status === 'rejected'
                      ? 'مرفوض'
                      : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
