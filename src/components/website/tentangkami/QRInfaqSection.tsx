// src/components/QRInfaqSection.tsx

import React from 'react';
import Image from 'next/image';

const QRInfaqSection: React.FC = () => {
  return (
    <div className="bg-white py-16 text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - QR Card */}
          <div className="flex justify-center md:justify-start">
            <div className="relative bg-white border-4 border-yellow-400 rounded-lg overflow-hidden shadow-lg max-w-sm">
              {/* Header */}
              <div className="bg-white p-4 flex items-center justify-between">
                <div>
                  <div className="text-black font-bold text-lg">QRIS</div>
                  <div className="text-xs text-gray-600">QR Code Standar</div>
                  <div className="text-xs text-gray-600">Pembayaran Nasional</div>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 font-bold text-2xl mr-1">G</span>
                  <span className="text-black font-bold text-lg">PN</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 pb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-black mb-2">DKM AL IKHLASH</h3>
                  <p className="text-sm text-gray-600">NMID : ID1022155720868</p>
                  <p className="text-sm text-gray-600 mt-1">A01</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-white border-2 border-gray-200 flex items-center justify-center">
                    <div className="w-44 h-44 bg-black bg-opacity-10 flex items-center justify-center text-xs text-gray-500">
                      QR Code
                      <br />
                      ID1022155720868
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-600">
                  <p className="font-semibold">SATU QRIS UNTUK SEMUA</p>
                  <p>Cek aplikasi penyelenggara</p>
                  <p>di: www.aspi-qris.id</p>
                </div>
              </div>

              {/* Red Triangle Decorations */}
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[60px] border-l-red-500 border-b-[60px] border-b-transparent"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[60px] border-r-red-500 border-t-[60px] border-t-transparent"></div>
            </div>
          </div>
          
          {/* Right side - Infaq information */}
          <div>
            <h2 className="text-3xl font-bold text-amber-700 mb-6">
              Infaq Masjid Melalui QR Scan
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Masjid Al Ikhlash menyediakan fasilitas Infaq bagi Jama'ah Masjid dengan 
                menggunakan QR Scan Barcode, disamping fasilitas kotak infaq yang 
                sudah tersedia terlebih dahulu.
              </p>
              
              <p className="leading-relaxed">
                Infaq melalui QRIS / QR Scan di Masjid Al Ikhlash adalah berinfaq dengan 
                metode Scan Barcode dan pembayarannya melalui payment getaway 
                seperti OVO, Gopay, Shopee Pay, Link Aja, Dana dan juga melalui Mobile 
                Banking Jama'ah.
              </p>
              
              <p className="leading-relaxed">
                Semakin mudah berinfaq dan beribadah di Masjid Al Ikhlash Vila Mutiara 
                Cikarang.
              </p>
            </div>

            {/* Payment method badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">OVO</div>
              <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">GoPay</div>
              <div className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Shopee Pay</div>
              <div className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">Link Aja</div>
              <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">DANA</div>
              <div className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Mobile Banking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRInfaqSection;