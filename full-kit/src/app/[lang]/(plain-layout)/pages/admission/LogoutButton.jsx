// components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });

    Swal.fire({
      icon: 'success',
      title: 'تم تسجيل الخروج',
      showConfirmButton: false,
      timer: 1500,
    });

    router.push('/sign-in');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm"
    >
      <LogOut size={16} />
      تسجيل الخروج
    </button>
  );
}
