'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Shield, CheckCircle, Calendar, Wallet, User2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

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

        if (!res.ok) throw new Error(data.message || 'Failed to load user data');
        setUser(data.user);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
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
    <div className="max-w-4xl mx-auto p-6 mt-10 font-[Cairo]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-right">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-700">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard
            icon={<Shield className="text-indigo-500 w-5 h-5" />}
            label="الدور"
            value={user.role === 'parent' ? 'ولي أمر' : user.role}
          />
          <ProfileCard
            icon={<CheckCircle className="text-green-500 w-5 h-5" />}
            label="البريد مفعل"
            value={user.emailVerified ? 'نعم' : 'لا'}
          />
          <ProfileCard
            icon={<Calendar className="text-blue-500 w-5 h-5" />}
            label="تاريخ التسجيل"
            value={new Date(user.createdAt).toLocaleDateString('ar-EG')}
          />
          <Link href="/pages/admission/me/financial" passHref>
  <div className="cursor-pointer">
    <ProfileCard
      icon={<Wallet className="text-yellow-500 w-5 h-5" />}
      label="رصيد المحفظة"
      value={user.wallet?.balance.toLocaleString('ar-EG') + ' EGP' || '0 EGP'}
    />
  </div>
</Link>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ icon, label, value }) {
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
