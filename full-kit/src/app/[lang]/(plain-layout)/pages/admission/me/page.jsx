'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split('; ')
              .find((row) => row.startsWith('token='))
              ?.split('=')[1] || ''}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load user data');
        }

        setUser(data.user);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-600 mt-10">
        تعذر تحميل بيانات المستخدم.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-right">الملف الشخصي</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div>
          <span className="font-semibold">الاسم الكامل:</span>
          <p>{user.name}</p>
        </div>
        <div>
          <span className="font-semibold">البريد الإلكتروني:</span>
          <p>{user.email}</p>
        </div>
        <div>
          <span className="font-semibold">الدور:</span>
          <p>{user.role === 'parent' ? 'ولي أمر' : user.role}</p>
        </div>
        <div>
          <span className="font-semibold">البريد مفعل:</span>
          <p>{user.emailVerified ? 'نعم' : 'لا'}</p>
        </div>
        <div>
          <span className="font-semibold">تاريخ التسجيل:</span>
          <p>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</p>
        </div>
      </div>
    </div>
  );
}
