import React from 'react';
import Image from 'next/image';

const QRInfaqSection = () => {
  return (
    <div className="bg-gradient-to-t from-slate-800 via-slate-900 to-slate-800 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left side - QR Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Glowing background effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-700"></div>
              
              {/* QR Image Container */}
              <div className="relative transform group-hover:scale-105 transition duration-500">
                {/* Replace with your QRIS image */}
                <Image 
                  src="/image/qrismasjid.jpg" 
                  alt="QRIS Masjid Al Muhajirin" 
                  width={400} 
                  height={500} 
                  className="rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                />
                
                {/* Fallback placeholder if image not found */}
                {/* Uncomment below if you want a placeholder */}
                {/* 
                <div className="w-96 h-[500px] bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl border-4 border-white/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-xl font-bold text-gray-700 mb-2">QRIS Image</div>
                    <div className="text-sm text-gray-500">
                      Ganti dengan path gambar QRIS Anda
                      <br />
                      /images/qris-masjid.png
                    </div>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>
          
          {/* Right side - Infaq information */}
          <div className="lg:pl-6">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-3">
                Infaq Masjid
              </h2>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Melalui QR Scan
              </h3>
            </div>
            
            <div className="space-y-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-slate-200 leading-relaxed">
                  Masjid Al Muhajirin menyediakan fasilitas <span className="text-amber-400 font-semibold">Infaq</span> bagi Jama'ah Masjid dengan 
                  menggunakan QR Scan Barcode, disamping fasilitas kotak infaq yang 
                  sudah tersedia terlebih dahulu.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-slate-200 leading-relaxed">
                  Infaq melalui <span className="text-amber-400 font-semibold">QRIS / QR Scan</span> di Masjid Al Muhajirin adalah berinfaq dengan 
                  metode Scan Barcode dan pembayarannya melalui payment gateway 
                  seperti berbagai aplikasi digital dan Mobile Banking Jama'ah.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-5 border border-amber-400/30">
                <p className="text-white leading-relaxed font-medium">
                  Semakin mudah berinfaq dan beribadah di <span className="text-amber-300">Masjid Al Muhajirin Vila Mutiara Cikarang</span>.
                </p>
              </div>
            </div>

            {/* Payment method badges */}
            <div className="mt-8">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Metode Pembayaran:</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-blue-600 transition-colors">OVO</div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-green-600 transition-colors">GoPay</div>
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-orange-600 transition-colors">Shopee Pay</div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-red-600 transition-colors">Link Aja</div>
                <div className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-cyan-600 transition-colors">DANA</div>
                <div className="bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-slate-700 transition-colors">Mobile Banking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRInfaqSection;