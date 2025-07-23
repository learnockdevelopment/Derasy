'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, Shield, CheckCircle, Calendar, Wallet, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      if (!res.ok) throw new Error(data.message || 'فشل تحميل البيانات');
      setUser(data.user);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchUser();
  }, []);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/me/avatar', {
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
      if (!res.ok) throw new Error(data.message || 'فشل رفع الصورة');

      Swal.fire({ icon: 'success', title: 'تم تحديث الصورة بنجاح' });

      setUser({ ...user, avatar: data.avatar });
      fetchUser(); // Refresh user data to ensure avatar is updated
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 h-64 justify-center items-center w-full max-w-md mx-auto">
        <div className="w-full h-6 rounded-md bg-gray-200 animate-pulse" />
        <div className="w-full h-4 rounded-md bg-gray-200 animate-pulse" />
        <div className="w-3/4 h-4 rounded-md bg-gray-200 animate-pulse" />
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
      <div className="bg-muted/40 shadow-2xl rounded-3xl p-10 text-right ">
        <div className="flex flex-col items-center mb-10 relative">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full shadow-lg border-4 border-purple-200"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-5xl font-extrabold shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {uploading && <p className="text-sm text-purple-500 mt-2">جاري رفع الصورة...</p>}
          <h2 className="text-2xl font-bold mt-5 text-foreground">{user.name}</h2>
          <p className="text-sm text-foreground">{user.email}</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard className="bg-muted/30 "
            icon={<Shield className={`w-5 h-5 ${roleColors[user.role]}`} />}
            label="الدور"
            value={
              <span className={`text-sm font-semibold ${roleBadgeClasses[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            }
          />

          <ProfileCard className="bg-muted/30 "
            icon={<CheckCircle className="text-green-500 w-5 h-5" />}
            label="البريد مفعل"
            value={user.emailVerified ? 'نعم' : 'لا'}
          />

          <ProfileCard className="bg-muted/30 "
            icon={<Calendar className="text-blue-500 w-5 h-5" />}
            label="تاريخ التسجيل"
            value={new Date(user.createdAt).toLocaleDateString('ar-EG')}
          />

          <Link href="/pages/admission/me/financial" passHref>
            <div className="cursor-pointer hover:scale-[1.02] transition-transform">
              <ProfileCard className="bg-muted/30 "
                icon={<Wallet className="text-yellow-500 w-5 h-5" />}
                label="رصيد المحفظة"
                value={
                  user.wallet?.balance?.toLocaleString('ar-EG') + ' جنيه' || '0 جنيه'
                }
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
