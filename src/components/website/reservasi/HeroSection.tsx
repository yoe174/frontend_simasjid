import React from "react";

const HeroSection = () => {
  return (
    <section className="top-0 left-0 w-full h-screen overflow-hidden z-0">
      {/* Gambar Latar Belakang */}
      <img
        src="/image/masjidhd2.jpg"
        alt="Masjid Background"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Overlay Gelap dan Konten */}
      <div className="absolute inset-0 bg-opacity-60 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">
          ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
        </h1>
        <p className="text-lg md:text-xl font-semibold max-w-2xl mb-4 text-black">
          Rencanakan Kehadiran Anda dan Manfaatkan Fasilitas Masjid!
        </p>
        <p className="text-lg md:text-xl  max-w-2xl mb-4 text-black">
          Temukan berbagai cara untuk berpartisipasi dan reservasi tempat Anda sekarang.
          Mari bersama memakmurkan rumah Allah.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;





