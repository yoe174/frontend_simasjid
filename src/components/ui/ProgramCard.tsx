// src/components/ui/ProgramCard.tsx

import React from 'react';
import Image from 'next/image';

interface ProgramCardProps {
  title: string;
  description: string;
  image: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ title, description, image }) => {
  return (
    <div className="flex flex-col items-center max-w-sm">
      <div className="mb-4 w-full h-48 relative">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h3 className="text-xl font-bold text-black mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-700 text-center">
        {description}
      </p>
    </div>
  );
};

export default ProgramCard;