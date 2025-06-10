// src/components/ReservationSection.tsx
"use client";

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';

const ReservationSection: React.FC = () => {
  const images = [
    '/image/masjidutama.jpg',
    '/image/halamanmasjid.jpg',
    '/image/halamanmasjid2.jpg',
    '/image/mimbarmasjid.jpg',
    '/image/tempatsholat.jpg',
    '/image/interiormasjid.jpg'
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-amber-500 pb-2 inline-block">
              Reservasi Masjid Al Muslimun
            </h2>
            <p className="text-white mt-6">
              Temukan berbagai layanan dan fasilitas yang tersedia di Masjid Al Muslimun. Rencanakan kunjungan atau partisipasi Anda dengan reservasi sekarang!
            </p>
            <p className="text-white mt-6">
            Kami menyediakan layanan reservasi Masjid untuk keperluan bersama dan tidak merugikan pihak manapun seperti acara akad, pengajian, buka bersama, dan lain lain yang masih berkaitan dengan kegiatan keagamaan.
            </p>         
          </div>
          
          {/* Right Content - Carousel */}
          <div className="w-full md:w-1/2">
            <Carousel images={images} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;