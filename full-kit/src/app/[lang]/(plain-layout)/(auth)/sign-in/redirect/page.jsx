'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      const generateToken = async () => {
        try {
          const response = await fetch('/api/login/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session }),
          });
          const { token } = await response.json();
          Cookies.set('token', token, { expires: 7 });
          if (session.accessToken) {
            Cookies.set('accessToken', session.accessToken, { expires: 7 });
          }
          setProgress(100);

          // Get redirect URL from query params or default to landing
          const callbackUrl = searchParams.get('callbackUrl') || '/pages/landing';
          
          // Ensure we don't redirect back to sign-in
          const safeRedirectUrl = callbackUrl.startsWith('/sign-in') 
            ? '/pages/landing' 
            : callbackUrl;

          setTimeout(() => router.push(safeRedirectUrl), 500);
        } catch (error) {
          console.error('فشل في إنشاء التوكن:', error);
          setProgress(100);
          setTimeout(() => router.push('/pages/landing'), 500);
        }
      };
      
      generateToken();
      
      return () => clearInterval(interval);
    }
  }, [status, session, router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center w-screen">
      {/* Google-style colored dots */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      </div>

      {/* Loading spinner */}
      <Loader2 className="w-10 h-10 mb-6 text-blue-500 animate-spin" />

      {/* Message with percentage */}
      <p className="text-gray-600 mb-2 text-lg">جاري تسجيل الدخول... {progress}%</p>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Status message */}
      <p className="text-sm text-gray-500">
        {progress < 30 ? 'جاري التهيئة...' : 
         progress < 70 ? 'جاري المصادقة...' : 
         progress < 100 ? 'جاري الإكمال...' : 'جاري التوجيه...'}
      </p>
    </div>
  );
}