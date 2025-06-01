'use client';

import React from 'react';
import { MessageCircle, Check } from 'lucide-react';

const WhatsAppCTASection = () => {
  // Konfigurasi WhatsApp
  const whatsappConfig = {
    phoneNumber: "6288292105178",
    message: `Assalamu'alaikum, saya tertarik untuk melakukan reservasi Masjid.

Mohon informasi lebih lanjut terkait:
- Nama : 
- Tempat : 
- Tanggal :
- Waktu :
- Jumlah tamu : 
- Acara :

Terima kasih.`
  };

  // Fungsi untuk membuka WhatsApp
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappConfig.message);
    const whatsappWebUrl = `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodedMessage}`;
    const whatsappAppUrl = `whatsapp://send?phone=${whatsappConfig.phoneNumber}&text=${encodedMessage}`;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = whatsappAppUrl;
      setTimeout(() => {
        window.open(whatsappWebUrl, '_blank');
      }, 2000);
    } else {
      window.open(whatsappWebUrl, '_blank');
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 lg:p-12 border border-slate-700/50 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Main Content - Horizontal Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - WhatsApp Icon and Text */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Anda berminat untuk reservasi?
            </h3>
            
            <p className="text-slate-400 text-base sm:text-lg mb-6 lg:mb-0">
              Hubungi kami melalui WhatsApp untuk informasi lebih lanjut
            </p>
          </div>

          {/* Right Side - CTA Button and Info */}
          <div className="space-y-6">
            {/* CTA Button */}
            <button
              onClick={openWhatsApp}
              className="group w-full bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <MessageCircle className="w-5 h-5" />
                <span className="text-lg">Klik disini untuk mengajukan</span>
              </div>
            </button>

            {/* Additional Info */}
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-sm text-slate-400 text-center flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Respon cepat melalui WhatsApp</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row - Full Width */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 lg:mt-12">
          <div className="text-center p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">24/7</div>
            <div className="text-sm sm:text-base text-slate-400">Layanan</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2 flex justify-center">
              <Check className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base text-slate-400">Terpercaya</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Free</div>
            <div className="text-sm sm:text-base text-slate-400">Konsultasi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCTASection;