// components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
  console.log('🟡 Logout initiated');
  
  try {
    console.log('⏳ Sending logout request to /api/logout');
    const response = await fetch('/api/logout', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('🔴 Logout failed with status:', response.status);
      throw new Error(`Logout failed: ${response.statusText}`);
    }

    console.log('✅ Logout API request successful');
    
    console.log('🔄 Showing success notification');
    await Swal.fire({
      icon: 'success',
      title: 'تم تسجيل الخروج',
      showConfirmButton: false,
      timer: 1500,
    });

    console.log('⏩ Redirecting to /sign-in');
    router.push('/sign-in');
    console.log('🏁 Logout process completed');

  } catch (error) {
    console.error('❌ Error during logout:', error);
    
    // Show error notification to user
    await Swal.fire({
      icon: 'error',
      title: 'خطأ في تسجيل الخروج',
      text: 'حدث خطأ أثناء محاولة تسجيل الخروج',
      confirmButtonText: 'حسناً',
    });

    console.log('🔄 Returning user to current page due to logout failure');
  }
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
