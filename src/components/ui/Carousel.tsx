// src/components/ui/Carousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ images, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Reset transition state after animation completes
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg shadow-lg">
        {/* Image Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={image}
                alt={`Carousel image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay for better contrast */}
              <div className="absolute inset-0 bg-opacity-10"></div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute inset-y-0 left-0 flex items-center justify-center w-12 bg-opacity-30 hover:bg-opacity-50 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-opacity-30 hover:bg-opacity-50 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`h-3 w-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
              index === currentIndex 
                ? 'bg-amber-500 scale-110 shadow-lg' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};