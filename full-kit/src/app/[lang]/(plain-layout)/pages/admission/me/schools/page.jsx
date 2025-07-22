'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  School,
  MapPin,
  Globe,
  Phone,
  ExternalLink,
  Building2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import SchoolCard from '@/components/school-card';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"
export default function MySchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();
  console.log('User from context:', user);
  useEffect(() => {
    async function fetchSchools() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const res = await fetch('/api/schools/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'فشل تحميل المدارس');

        setSchools(data.schools || []);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
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
    <div className="container mx-auto p-6 font-[Cairo]">
      {/* 🌟 Branding Slogan Banner */}
      <div className="bg-gray-200 border-y border-gray-200 py-6 text-center shadow-sm mt-25 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          نحن منصّة دراسي – نُعلّم، نُرشد، ونفتح أبواب المستقبل.
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          من خلال منصتنا، يمكن للطلاب طلب كارنيهاتهم إلكترونيًا، ويقوم مدير المدرسة بمراجعتها والموافقة عليها بضغطة زر.
        </p>
      </div>
      {user && (<div className="text-center mb-8">
        <div className="flex items-center justify-start gap-3 mb-4">
          <Avatar className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-purple-700">
            <AvatarImage src={user?.avatar || ""} alt={user?.fullName || "User"} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div className="text-start">
            <h1 className="text-2xl font-bold text-purple-700">مرحبًا بعودتك، {user?.fullName} 👋</h1>
            <p className="text-muted-foreground text-sm">هذه هي المدارس التي تمتلكها.</p>
          </div>
        </div>
      </div>)}


      {schools.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">لا توجد مدارس مسجلة باسمك.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <SchoolCard school={school} key={school._id} />
          ))}
        </div>
      )}
    </div>
  );
}
