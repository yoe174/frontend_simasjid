// src/components/DonationSection.tsx

import React from 'react';
import Image from 'next/image';

const DonationSection: React.FC = () => {
  return (
    <div className="bg-amber-50 py-16 text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Donation information */}
          <div>
            <h2 className="text-3xl font-bold text-amber-700 mb-6">
              Tunaikan INFAQ terbaik anda, melalui transfer berikut
            </h2>
            <div className="mt-4">
              <p className="font-bold text-2xl">BANK SYARIAH INDONESIA</p>
              <p className="text-xl mt-2">No. Rekening : 27-272-2727</p>
              <p className="text-xl mt-2">A/N : MASJID AL IMAM</p>
            </div>
          </div>
          
          {/* Right side - Bank logo */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-teal-500 rounded-lg p-8 max-w-md">
              <Image 
                src="/image/bsilogo.jpg" 
                alt="Bank Syariah Indonesia" 
                width={300} 
                height={150}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSection;