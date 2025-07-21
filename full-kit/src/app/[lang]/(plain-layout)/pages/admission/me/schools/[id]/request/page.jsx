'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function StudentCardRequestForm() {
  const { id } = useParams(); // school ID
  const [fields, setFields] = useState([]);
  const [templateImage, setTemplateImage] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchFields() {
      try {
        const res = await fetch(`/api/schools/my/${id}`);
        const data = await res.json();
console.log('Fetched fields:', data);
        if (!res.ok) throw new Error(data.message);
        setFields(data.school?.studentIdCardFields || []);
        setTemplateImage(data.school?.idCard.url || '');
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchFields();
  }, [id]);

  function handleChange(key, value) {
    setFormData({ ...formData, [key]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    for (const field of fields) {
      if (!formData[field.key]) {
        Swal.fire({ icon: 'warning', title: 'تنبيه', text: `يرجى تعبئة ${field.key}` });
        return;
      }
    }

    try {
      console.log('Submitting:', formData);
      Swal.fire({ icon: 'success', title: 'تم الإرسال بنجاح' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
    }
  }

  if (loading) return <p className="text-center mt-10">جاري تحميل البيانات...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-8">
      {/* ✅ النموذج */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow font-[Cairo] border">
        <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">طلب بطاقة طالب</h2>

        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1 font-semibold">{field.key}</label>
            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
            {field.type === 'date' && (
              <input
                type="date"
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
            {field.type === 'photo' && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(field.key, e.target.files[0])}
                className="w-full border rounded p-2"
              />
            )}
            {field.type === 'select' && (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">اختر</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div className="text-center mt-6">
          <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
            إرسال الطلب
          </button>
        </div>
      </form>

      {/* ✅ معاينة البطاقة */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-center">معاينة البطاقة</h2>

        <div className="relative w-full h-[300px] border rounded overflow-hidden">
          {templateImage ? (
            <Image
              src={templateImage}
              alt="بطاقة الطالب"
              layout="fill"
              objectFit="cover"
              className="z-0"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
              لا يوجد قالب للبطاقة
            </div>
          )}

          {/* البيانات تظهر فوق البطاقة */}
          {fields.map((field, i) => {
            const style = field.style || {};
            const value = formData[field.key];

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
              backgroundColor: "transparent",
              padding: '2px',
              borderRadius: '4px',
              zIndex: 10
            };

            if (field.type === 'photo' && value instanceof File) {
              const previewURL = URL.createObjectURL(value);
              return (
                <img
                  key={i}
                  src={previewURL}
                  alt={field.key}
                  style={{ ...commonStyle, objectFit: 'cover', border: '1px solid #ccc' }}
                />
              );
            }

            return (
              <div key={i} style={commonStyle}>
                {value || '---'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
