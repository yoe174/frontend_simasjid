import React from 'react';
import Image from 'next/image';

const DonationSection = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
        
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rotate-45"></div>
          <div className="absolute top-32 right-32 w-16 h-16 border-2 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white rotate-45"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
              <span className="text-emerald-200 font-medium">Transfer Bank</span>
            </div> */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Tunaikan <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">INFAQ</span> Terbaik Anda
            </h2>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
              Melalui transfer bank yang mudah dan aman untuk keberkahan bersama
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Bank Information */}
            <div className="space-y-8">
              {/* Bank Details Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🏦</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Bank Transfer</h3>
                    <p className="text-emerald-200">Informasi Rekening</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Bank Name */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-emerald-300 text-sm font-medium mb-1">NAMA BANK</p>
                    <p className="text-white font-bold text-xl">BANK SYARIAH INDONESIA</p>
                  </div>
                  
                  {/* Account Number */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-emerald-300 text-sm font-medium mb-1">NOMOR REKENING</p>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-bold text-2xl font-mono">7300744456</p>
                    </div>
                  </div>
                  
                  {/* Account Name */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-emerald-300 text-sm font-medium mb-1">ATAS NAMA</p>
                    <p className="text-white font-bold text-xl">MASJID AL ALMUSLIMUN</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30">
                <div className="flex items-start gap-4">
                  {/* <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm"></span>
                  </div> */}
                  <div>
                    <p className="text-emerald-100 text-l leading-relaxed font-bold">
                      Baarakallahu fiikum wa ja'alahuu fii miizaani hasanaatikum
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Bank Logo */}
            <div className="flex justify-center">
              <div className="relative group w-full max-w-lg">
                {/* Glowing background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition duration-700"></div>
                
                {/* Logo Container */}
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl transform group-hover:scale-105 transition duration-500 w-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-teal-800 mb-2">Bank Partner</h3>
                    <p className="text-teal-600">Perbankan Syariah Terpercaya</p>
                  </div>
                  
                  {/* Bank Logo - Diperbesar dan dipusatkan */}
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-8 border-2 border-teal-100 flex items-center justify-center min-h-[200px]">
                    <Image 
                      src="/image/bsilogo.jpg" 
                      alt="Bank Syariah Indonesia" 
                      width={500} 
                      height={500}
                      className="object-contain w-full h-auto max-h-[180px]"
                    />
                  </div>
                  
                  {/* Benefits */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-teal-700">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm font-medium">Transfer 24/7</span>
                    </div>
                    <div className="flex items-center gap-3 text-teal-700">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm font-medium">Prinsip Syariah</span>
                    </div>
                    <div className="flex items-center gap-3 text-teal-700">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm font-medium">Aman & Terpercaya</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {/* <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Barakallahu fiikum 🤲
              </h3>
              <p className="text-emerald-200 mb-6">
                Semoga Allah SWT memberikan keberkahan atas infaq yang Anda berikan
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                  Konfirmasi Transfer
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold transition-all">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DonationSection;