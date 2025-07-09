'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield, CheckCircle, Calendar, Wallet } from 'lucide-react';
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
const roleLabels = {
  parent: 'ولي أمر',
  school_owner: 'مالك مدرسة',
  moderator: 'مشرف',
  admin: 'مدير',
};

const roleBadgeClasses = {
  parent: 'text-purple-600 bg-purple-50 px-2 py-1 rounded-md',
  school_owner: 'text-blue-600 bg-blue-50 px-2 py-1 rounded-md',
  moderator: 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md',
  admin: 'text-red-600 bg-red-50 px-2 py-1 rounded-md',
};

const roleColors = {
  parent: 'text-purple-500',
  school_owner: 'text-blue-500',
  moderator: 'text-yellow-500',
  admin: 'text-red-500',
};

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 font-[Cairo]">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-right border border-purple-100">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-5xl font-extrabold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mt-5 text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard
            icon={<Shield className={`w-5 h-5 ${roleColors[user.role]}`} />}
            label="الدور"
            value={
              <span className={`text-sm font-semibold ${roleBadgeClasses[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            }
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
            <div className="cursor-pointer hover:scale-[1.02] transition-transform">
              <ProfileCard
                icon={<Wallet className="text-yellow-500 w-5 h-5" />}
                label="رصيد المحفظة"
                value={user.wallet?.balance?.toLocaleString('ar-EG') + ' جنيه' || '0 جنيه'}
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
    <div className="bg-gray-50 border border-gray-200 hover:border-purple-300 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition duration-300">
      <div className="p-2 bg-white rounded-full shadow-md">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-base font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
