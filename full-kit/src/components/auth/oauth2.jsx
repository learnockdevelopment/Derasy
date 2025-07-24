'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export function OAuthButtons({callbackUrl}) {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: `/sign-in/redirect?callbackUrl=${callbackUrl}` });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium bg-white shadow"
      >
        <FcGoogle className="w-5 h-5" />
        <span>تسجيل الدخول بواسطة Google</span>
      </button>
    </div>
  );
}
