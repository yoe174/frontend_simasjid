'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
}

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
}

interface ApiResponse {
  data: {
    timings: PrayerTimesData;
    date: {
      readable: string;
      hijri: {
        date: string;
        month: {
          en: string;
        };
        year: string;
      };
    };
  };
}

const PrayerScheduleSection: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Koordinat Malang, Jawa Timur
  const getCoordinates = () => ({
    latitude: -7.9666,
    longitude: 112.6326
  });

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=2`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      
      const data: ApiResponse = await response.json();
      const timings = data.data.timings;
      
      const formattedPrayerTimes: PrayerTime[] = [
        { name: 'Fajr', time: formatTime(timings.Fajr) },
        { name: 'Sunrise', time: formatTime(timings.Sunrise) },
        { name: 'Dhuhr', time: formatTime(timings.Dhuhr) },
        { name: 'Asr', time: formatTime(timings.Asr) },
        { name: 'Maghrib', time: formatTime(timings.Maghrib) },
        { name: 'Isha', time: formatTime(timings.Isha) },
      ];
      
      setPrayerTimes(formattedPrayerTimes);
      setGregorianDate(data.data.date.readable);
      setHijriDate(`${data.data.date.hijri.date} ${data.data.date.hijri.month.en}, ${data.data.date.hijri.year}H`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const { latitude, longitude } = getCoordinates();
    fetchPrayerTimes(latitude, longitude);
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading prayer times...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-red-500 text-sm mb-2">❌ Error: {error}</div>
            <button 
              onClick={() => {
                const { latitude, longitude } = getCoordinates();
                fetchPrayerTimes(latitude, longitude);
              }}
              className="bg-amber-500 text-white px-4 py-1 rounded text-sm hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-white py-8">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto"> {/* Lebar tabel ditingkatkan */}
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-wide">
            JADWAL SHOLAT
          </h1>
        </div>

        {/* Prayer Times Table */}
        <div className="bg-white border border-gray-300 shadow-lg overflow-hidden text-sm rounded-md">
          {/* Location and Date Header */}
          <div className="bg-white border-b border-gray-300 px-6 py-4">
            <div className="text-center">
              <p className="text-amber-500 font-semibold text-base mb-1">Malang, Indonesia</p>
              <p className="text-gray-600 text-xs mb-2">{hijriDate}</p>
              <div className="bg-gray-600 text-white py-1 px-3 inline-block text-sm rounded">
                <p className="font-semibold">{gregorianDate}</p>
              </div>
            </div>
          </div>

          {/* Prayer Times Rows */}
          <div>
            {prayerTimes.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex justify-between items-center px-6 py-3 border-b border-gray-300 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="text-gray-800 font-medium text-base">{prayer.name}</div>
                <div className="text-gray-800 font-semibold text-base">{prayer.time}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-300 px-4 py-2 text-center">
            <p className="text-xs text-gray-600">
              Powered By: 
              <a 
                href="https://www.islamicfinder.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-600 font-medium ml-1"
              >
                www.islamicfinder.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default PrayerScheduleSection;