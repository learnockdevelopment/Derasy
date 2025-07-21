'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentCardViewPage() {
  const { id, requestId } = useParams(); // School ID and Request ID
  const [request, setRequest] = useState(null);
  const [templateImage, setTemplateImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !requestId) return;

    async function fetchRequest() {
      try {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
        const token = match ? match[1] : null;

        const res = await fetch(`/api/schools/my/${id}/card/request/${requestId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setRequest(data.request);
        setTemplateImage(data?.request?.school?.idCard?.url || '');
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [id, requestId]);

  if (loading) return <p className="text-center mt-10">جاري تحميل البطاقة...</p>;

  if (!request)
    return <p className="text-center mt-10 text-gray-600">لم يتم العثور على الطلب</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white shadow rounded p-4">
        <div className="relative w-full h-[350px] border rounded overflow-hidden mb-4">
          {request.school.idCard.url ? (
            <Image
              src={request.school.idCard.url || templateImage}
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

          {request.school.studentIdCardFields.map((field, i) => {
            const style = field.style || {};
            const submittedValue = request.fields?.find(f => f.key === field.key)?.value;

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
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold 
              ${request.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : request.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
          >
            {request.status === 'approved'
              ? 'تم القبول'
              : request.status === 'rejected'
                ? 'مرفوض'
                : 'قيد المراجعة'}
          </span>
        </div>
      </div>
    </div>
  );
}
