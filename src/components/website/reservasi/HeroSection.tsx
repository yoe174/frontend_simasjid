'use client';
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="top-0 left-0 w-full h-screen overflow-hidden z-0">
      {/* Gambar Latar Belakang */}
      <img
        src="/image/masjidhd3.jpg"
        alt="Masjid Background"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Overlay Gelap dan Konten */}
      <div className="absolute inset-0 bg-opacity-60 flex flex-col items-center justify-center text-white text-center px-4">
        <motion.h1
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">
          ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
        </motion.h1>
        <motion.p 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl font-semibold max-w-2xl mb-4 text-white font-serif">
          Rencanakan Kehadiran Anda dan Manfaatkan Fasilitas Masjid!
        </motion.p>
        <motion.p 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl  max-w-2xl mb-4 text-white font-serif">
          Temukan berbagai cara untuk berpartisipasi dan reservasi tempat Anda sekarang.
          Mari bersama memakmurkan rumah Allah.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;





