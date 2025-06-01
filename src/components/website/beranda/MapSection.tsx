import React from 'react';
import Image from 'next/image';

const MapSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 text-white p-6 rounded-lg">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-bold text-yellow-500">Lokasi Masjid Al-Muhajirin</h1>
        <p className="text-sm text-gray-300"></p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Contact Information Card */}
        <div className="bg-gray-200 rounded-lg p-6 text-black w-full md:w-5/12">
          <h2 className="text-lg font-bold mb-1">Kontak</h2>
          <p className="text-sm text-gray-600 mb-6">Deskripsi Kontak</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Lokasi</h3>
                <p className="text-sm">Jalan Salam</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Informasi</h3>
                <p className="text-sm">(0341) 325359</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-sm">masjidkami@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="w-full md:w-7/12 h-64 md:h-auto rounded-lg overflow-hidden relative">
         <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.5325724742365!2d112.596227!3d-7.943785999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78826aa62c5cf1%3A0x6182180b9250f37e!2sMosque%20Al-Muhajirin!5e0!3m2!1sen!2sid!4v1747799952288!5m2!1sen!2sid"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-lg absolute top-0 left-0 w-full h-full"
  ></iframe>
          {/* Map Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="w-2 h-2 bg-red-600 rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
