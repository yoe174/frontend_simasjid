import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 md:px-10 bg-white">
      {/* Main Footer Content */}
      <div className="container mx-auto">
        {/* Logo and Information Section */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="mr-4 w-[130px] h-[130px] flex items-center justify-center overflow-hidden">
          <Image 
            src="/image/logomasjid2.png" 
            alt="Masjid Raya Al-Muhajjirin Logo" 
            width={300} // Bebas diperbesar
            height={300} 
            className="object-contain"
          />
        </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Masjid </p>
              <h2 className="text-2xl font-bold text-blue-900">Al-Muhajirin</h2>
            </div>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Alamat Lengkap */}
          <div className="flex">
            <div className="mr-3 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Alamat Lengkap</h3>
              <p className="text-sm text-gray-600 mt-2">
                Jl. Perum Joyo Grand, RW.08, Merjosari, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex">
            <div className="mr-3 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Email</h3>
              <p className="text-sm text-gray-600 mt-2">
                aljabbar@jabarprov.go.id
              </p>
            </div>
          </div>

          {/* Kontak DKM */}
          <div className="flex">
            <div className="mr-3 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Kontak DKM</h3>
              <p className="text-sm text-gray-600 mt-2">
                Birokesra : (+62) 8170202155
              </p>
            </div>
          </div>

          {/* Sosial Media */}
          <div className="flex">
            <div className="mr-3 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Sosial Media</h3>
              <div className="flex items-center space-x-4 mt-2">
                <Link href="https://instagram.com" className="flex items-center text-gray-600 hover:text-gray-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="ml-1">Instagram</span>
                </Link>
                <Link href="https://youtube.com" className="flex items-center text-gray-600 hover:text-gray-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="ml-1">Youtube</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">Dewan Kemakmuran Masjid Raya Al-Imam Malang</p>
          <p className="text-gray-600">Copyright © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;