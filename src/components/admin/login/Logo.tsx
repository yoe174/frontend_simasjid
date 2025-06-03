// components/Logo.tsx
import React from 'react';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-3 mb-8">
      {/* Logo Icon */}
      <div className="relative">
        <div className="flex items-center h-20 relative z-10">
                  <Image
                    src="/image/logomasjid2.png" 
                        alt="Masjid Raya Al-Muhajjirin Logo"
                    width={200}
                    height={200}
                    className="object-contain -mt-4"
                    priority
                  />
                </div>
        {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div> */}
        {/* Glow Effect */}
        {/* <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md opacity-50 -z-10"></div> */}
      </div>
      
      {/* Logo Text */}
      <h1 className="text-2xl font-bold text-white">
        {/* Masjid <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Al-Muhajirin</span> */}
      </h1>
    </div>
  );
};

export default Logo;