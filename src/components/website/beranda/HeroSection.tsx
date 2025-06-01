'use client';

import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative top-0 left-0 w-full h-screen overflow-hidden z-0">
      {/* Gambar Latar Belakang */}
      <img
        src="/image/masjidhd3.jpg"
        alt="Masjid Background"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Overlay Gelap dan Konten */}
      <div className="absolute inset-0 bg-opacity-60 flex flex-col items-center justify-center text-white text-center px-4">
        {/* Animasi Judul */}
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-amber-400"
        >
          ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
        </motion.h1>

        {/* Animasi Deskripsi */}
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl text-sm md:text-base text-white font-serif font-semibold"
        >
          Selamat Datang di Masjid Al Muhajjirin Vila Mutiara Cikarang. Masjid yang pertama
          dibangun tahun 2003 dan mengalami renovasi total pada tahun 2018 yang
          berlokasi di Jl. Anggrek Vila Mutiara Cikarang, Cikarang Selatan, Bekasi.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
