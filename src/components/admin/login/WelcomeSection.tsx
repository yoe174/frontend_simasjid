// components/WelcomeSection.tsx
import React from 'react';

const WelcomeSection: React.FC = () => {
  return (
    <div className="max-w-2xl text-center space-y-8 relative">
      {/* Main Welcome Content */}
      <div className="space-y-6">
        {/* Arabic Greeting - Above Selamat Datang */}
        <div className="space-y-2 mb-4">
          <p className="text-2xl lg:text-3xl font-bold text-amber-400 drop-shadow-lg">
            ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
          </p>
        </div>

        {/* Administrator Greeting */}
        <div className="space-y-3">
          <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-xl">
            Selamat Datang
          </h1>
          <p className="text-xl lg:text-2xl font-semibold text-blue-100 drop-shadow-lg">
            Administrator!
          </p>
        </div>

        {/* Description */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-2xl">
          <p className="text-lg text-white leading-relaxed">
            Silakan login menggunakan akun Anda untuk mengakses 
            <span className="font-semibold text-amber-300"> fitur-fitur pengelolaan website</span> dan 
            melakukan konfigurasi yang diperlukan.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-md rounded-xl p-4 border border-blue-300/30 shadow-lg">
            <div className="text-2xl mb-2">🔐</div>
            <p className="text-sm text-blue-100 font-medium">Akses Aman</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/30 backdrop-blur-md rounded-xl p-4 border border-purple-300/30 shadow-lg">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-purple-100 font-medium">Panel Admin</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500/30 to-teal-600/30 backdrop-blur-md rounded-xl p-4 border border-teal-300/30 shadow-lg">
            <div className="text-2xl mb-2">🎨</div>
            <p className="text-sm text-teal-100 font-medium">Kelola Website</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Repositioned */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top decorations */}
        <div className="absolute top-0 left-8 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-16 right-16 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-lg rotate-45 backdrop-blur-sm"></div>
        
        {/* Side decorations */}
        <div className="absolute left-0 top-1/2 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute right-0 top-1/3 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full translate-x-1/2"></div>
        
        {/* Bottom decorations */}
        <div className="absolute bottom-8 left-1/4 w-8 h-8 bg-gradient-to-br from-yellow-400/40 to-amber-500/40 rounded-full"></div>
        <div className="absolute bottom-4 right-1/3 w-6 h-6 bg-gradient-to-br from-blue-300/40 to-indigo-500/40 rounded-full"></div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="welcomePattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" opacity="0.3"/>
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welcomePattern)" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeSection;