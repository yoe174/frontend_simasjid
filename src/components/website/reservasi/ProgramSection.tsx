// src/components/ProgramsSection.tsx

import React from 'react';
import Image from 'next/image';
import ProgramCard from '@/components/ui/ProgramCard';

const ProgramsSection: React.FC = () => {
  const programs = [
    {
      id: 1,
      title: "Jumat Berkah",
      description: "Jadwalkan donasi spesial Anda untuk program Jumat Berkah dan raih keberkahan berlipat.",
      image: "/image/jumatberkah.jpg"
    },
    {
      id: 2,
      title: "Santunan Yatim",
      description: "Daftarkan diri atau kelompok Anda untuk memberikan santunan dan menyantuni anak-anak yatim yang membutuhkan.",
      image: "/image/santunanyatim.jpg"
    },
    {
      id: 3,
      title: "Bakti Sosial",
      description: "Ikuti berbagai kegiatan bakti sosial yang kami adakan. Segera reservasi tempat Anda dan berikan kontribusi nyata bagi masyarakat.",
      image: "/image/baktisosial.jpg"
    }
  ];

  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center font-serif mb-12">
          Jadikan Setiap Langkah Berkah Bersama Masjid Al Muslimun
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {programs.map(program => (
            <ProgramCard 
              key={program.id}
              title={program.title}
              description={program.description}
              image={program.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsSection;