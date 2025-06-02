'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/website/beranda" },
    { name: "Tentang Kami", href: "/website/tentangkami" },
    { name: "Reservasi", href: "/website/reservasi" },
    { name: "Login Admin", href: "/admin/login" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-amber-100' 
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <nav className="px-6 lg:px-10 h-20 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center h-20 relative z-20">
          <Link href="/website/beranda" className="flex items-center group">
            <div className="relative overflow-hidden rounded-full p-2 group-hover:bg-amber-50 transition-colors duration-300">
              <Image
                src="/image/logomasjid2.png" 
                alt="Masjid Raya Al-Muhajjirin Logo"
                width={150}
                height={150}
                className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div 
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden group ${
                  isActive(item.href)
                    ? isScrolled
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                      : 'bg-white/20 text-white border border-white/30'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      : 'text-white hover:bg-white/10 hover:text-amber-200'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {!isActive(item.href) && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-amber-50 to-amber-100' 
                      : 'bg-white/10'
                  }`} />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Contact/CTA Button */}
        <div className="hidden md:flex items-center">
          <a 
            href="https://wa.me/6282268608092?text=Assalamualaikum%2C%20saya%20ingin%20bertanya%20tentang%20Masjid%20Raya%20Al-Muhajjirin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isScrolled
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-green-200'
                : 'bg-white text-green-700 hover:bg-green-50'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative z-20 p-2 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`w-6 h-0.5 transition-all duration-300 ${
            isScrolled ? 'bg-gray-700' : 'bg-white'
          } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 mt-1.5 transition-all duration-300 ${
            isScrolled ? 'bg-gray-700' : 'bg-white'
          } ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 mt-1.5 transition-all duration-300 ${
            isScrolled ? 'bg-gray-700' : 'bg-white'
          } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Menu */}
        <div className={`absolute top-full left-0 right-0 md:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white/95 backdrop-blur-lg border-t border-amber-100 shadow-xl">
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                        : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <a 
                href="https://wa.me/6282268608092?text=Assalamualaikum%2C%20saya%20ingin%20bertanya%20tentang%20Masjid%20Raya%20Al-Muhajjirin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button 
                  className="flex items-center justify-center gap-2 w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Hubungi Kami
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;