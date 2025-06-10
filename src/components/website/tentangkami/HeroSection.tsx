'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        {/* Background image with parallax effect */}
        <div className="w-full h-full transform scale-110 transition-transform duration-[24s] ease-out hover:scale-105">
          <img 
            src="/image/masjidhd2.jpg" 
            alt="Background" 
            className="w-full h-full object-cover filter blur-sm"
          />
        </div>
        
        {/* Animated dark overlay */}
        <div className="absolute inset-0 bg-slate-900/80 animate-pulse duration-[8s]"></div>
      </div>

      {/* Animated background geometric pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 border-r-4 border-t-4 border-slate-700 opacity-30 animate-bounce duration-[4s]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border-l-4 border-b-4 border-slate-700 opacity-30 animate-bounce duration-[3s] delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/40 animate-pulse duration-[12s]"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Mosque image with modern frame and animations */}
          <div className={`relative transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            {/* Yellow accent frame with rotation animation */}
            <div className="absolute -top-6 -left-6 w-full h-full bg-yellow-400 rounded-lg transform rotate-1 z-0 transition-transform duration-300 hover:rotate-2 hover:scale-105"></div>
            
            {/* Main image container with hover effects */}
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl group">
              <div className="transform transition-transform duration-500 group-hover:scale-110">
                <img 
                  src="/image/masjidhd3.jpg" 
                  alt="Masjid Al-Ikhlash" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Overlay effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Right side - About information with staggered animations */}
          <div className={`text-white space-y-8 transform transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            {/* Section label with slide animation */}
            <div className={`flex items-center space-x-4 transform transition-all duration-800 ease-out delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="w-12 h-0.5 bg-yellow-400 transform origin-left transition-transform duration-1000 scale-x-0 animate-pulse" 
                   style={{ animationDelay: '1s', animationFillMode: 'forwards', transform: isVisible ? 'scaleX(1)' : 'scaleX(0)' }}></div>
              <span className="text-yellow-400 text-sm font-medium tracking-wider uppercase animate-pulse">
                
              </span>
            </div>
            
            {/* Main heading with typewriter effect */}
            <h1 className={`text-5xl lg:text-6xl font-bold leading-tight transform transition-all duration-1000 ease-out delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="inline-block animate-pulse">About</span>{' '}
              <span className="inline-block animate-pulse delay-300">Us</span>
            </h1>
            
            {/* Content paragraphs with fade-in animation */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className={`text-lg transform transition-all duration-1000 ease-out delay-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } hover:text-white transition-colors duration-300`}>
                Masjid Al Muslimun merupakan sebuah Masjid sederhana yang dibangun di 
                atas lahan fasilitas umum di Jl. Cengger Ayam DLM No.67, Tulusrejo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141.
                Bangunan Masjid seluas ± 210 m2 mulai dibangun pada tahun 2003 
                melalui sumbangan tanah fasum dari pengembang dan dana swadaya 
                masyarakat.
              </p>
              
              <p className={`text-lg transform transition-all duration-1000 ease-out delay-1200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } hover:text-white transition-colors duration-300`}>
                Pada tahun 2020 Masjid Al Muslimun mengalami renovasi total menjadi lebih luas
                dengan desain baru yang lebih artistik dan modern. Renovasi total 
                menghabiskan anggaran sekitar Rp 1.7 M dengan menggunakan dana 
                infaq dan swadaya murni dari jama'ah masjid, selesai pekerjaan renovasi 
                selama sembilan bulan.
              </p>
            </div>
            
            {/* CTA Button with hover animations */}
            <div className={`pt-4 transform transition-all duration-1000 ease-out delay-1400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated decorative elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-yellow-400 rounded-full opacity-40 animate-pulse delay-500"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-bounce delay-1000"></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-yellow-400/50 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-yellow-400/30 rounded-full animate-bounce delay-1500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse duration-[2s]"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-yellow-400/30 rounded-full animate-bounce duration-[3s]"></div>
        <div className="absolute top-1/2 left-1/12 w-0.5 h-0.5 bg-yellow-400/40 rounded-full animate-ping duration-[4s]"></div>
      </div>
    </div>
  );
};

export default HeroSection;