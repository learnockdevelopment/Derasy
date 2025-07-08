'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingLottie({ className = 'w-32 h-32' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <DotLottieReact
        src="https://lottie.host/cff7113c-8a7c-478c-8df0-a66a495ed98e/TqXYOXbNYa.lottie"
        loop
        autoplay
      />
    </div>
  );
}
