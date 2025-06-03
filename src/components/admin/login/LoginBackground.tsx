// components/LoginBackground.tsx
import React from 'react';

const LoginBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background Image */}
      <img
        src="/image/loginkeren.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Optional Gradient Overlay (hapus jika tidak dibutuhkan) */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-30 z-10"></div> */}

      {/* Animated Circles - Bright and Visible
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/40 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-pulse delay-1000 z-20"></div>
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-300/30 rounded-full blur-2xl animate-pulse delay-500 z-20"></div> */}

      {/* Floating Particles - Bright Ping Effect */}
      <div className="absolute inset-0 z-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/60 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginBackground;
