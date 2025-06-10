'use client';

import { useState, useEffect } from "react";
import { X, Calendar, Users, MapPin, Clock, User, AlertCircle, RefreshCw } from "lucide-react";

interface EventData {
  kegiatan_id: number; // Changed from id to kegiatan_id
  nama_kegiatan: string;
  isi: string;
  tanggal: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  lokasi: string;
  image?: string;
  status: 'dijadwalkan' | 'dilaksanakan' | 'selesai' | 'dibatalkan';
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

const EventsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Base URL untuk API - menggunakan environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

  // Function untuk menentukan status berdasarkan tanggal
  const getAutoStatus = (eventDate: string): 'dijadwalkan' | 'dilaksanakan' | 'selesai' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time untuk perbandingan tanggal saja
    
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);
    
    if (eventDateObj > today) {
      return 'dijadwalkan'; // Tanggal event di masa depan
    } else if (eventDateObj.getTime() === today.getTime()) {
      return 'dilaksanakan'; // Tanggal event hari ini
    } else {
      return 'selesai'; // Tanggal event sudah lewat
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/kegiatan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const eventsData = Array.isArray(data) ? data : [];
      
      // Update status berdasarkan tanggal untuk setiap event
      const eventsWithAutoStatus: EventData[] = eventsData.map((event: any) => ({
        ...event,
        status: (event.status === 'dibatalkan' ? 'dibatalkan' : getAutoStatus(event.tanggal)) as EventData['status']
      }));
      
      setEvents(eventsWithAutoStatus);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single event detail - Fixed to use kegiatan_id
  const fetchEventDetail = async (kegiatan_id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/kegiatan/${kegiatan_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update status berdasarkan tanggal
      const eventWithAutoStatus: EventData = {
        ...data,
        status: (data.status === 'dibatalkan' ? 'dibatalkan' : getAutoStatus(data.tanggal)) as EventData['status']
      };
      
      return eventWithAutoStatus;
    } catch (err) {
      console.error('Error fetching event detail:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = async (event: EventData) => {
    // Fetch detail lengkap dari API using kegiatan_id
    const detailEvent = await fetchEventDetail(event.kegiatan_id);
    if (detailEvent) {
      setSelectedEvent(detailEvent);
    } else {
      // Jika gagal fetch detail, gunakan data dari list dengan status yang sudah diupdate
      const eventWithAutoStatus: EventData = {
        ...event,
        status: (event.status === 'dibatalkan' ? 'dibatalkan' : getAutoStatus(event.tanggal)) as EventData['status']
      };
      setSelectedEvent(eventWithAutoStatus);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  // Format tanggal untuk display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format waktu
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Ambil HH:MM saja
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dijadwalkan':
        return 'from-blue-400 to-blue-600';
      case 'dilaksanakan':
        return 'from-green-400 to-green-600';
      case 'selesai':
        return 'from-gray-400 to-gray-600';
      case 'dibatalkan':
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'dijadwalkan':
        return 'Dijadwalkan';
      case 'dilaksanakan':
        return 'Sedang Berlangsung';
      case 'selesai':
        return 'Selesai';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  // Get image URL
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzM0MTU1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGlkYWsgQWRhIEdhbWJhcjwvdGV4dD4KPC9zdmc+';
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Memuat data kegiatan...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Gagal memuat data</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
            Kegiatan Masjid
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Kegiatan yang berlangsung di lingkungan Masjid Al-Muslimun
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-pink-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Belum ada kegiatan yang tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={`event-${event.kegiatan_id}-${index}`} // Fixed to use kegiatan_id
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-105"
              >
                {/* Image container with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.nama_kegiatan}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/300';
                    }}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`bg-gradient-to-r ${getStatusColor(event.status)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
                    {event.nama_kegiatan}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.isi}
                  </p>

                  {/* Quick info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-2" />
                      <span>{formatDate(event.tanggal)}</span>
                    </div>
                    {(event.waktu_mulai || event.waktu_selesai) && (
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock className="w-3 h-3 mr-2" />
                        <span>
                          {formatTime(event.waktu_mulai)}
                          {event.waktu_selesai && ` - ${formatTime(event.waktu_selesai)}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-400 text-xs">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span className="line-clamp-1">{event.lokasi}</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => openModal(event)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Lihat Detail
                  </button>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-500 via-slate-600 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative inline-block w-full max-w-3xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img
                  src={getImageUrl(selectedEvent.image)}
                  alt={selectedEvent.nama_kegiatan}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/400/300';
                  }}
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`bg-gradient-to-r ${getStatusColor(selectedEvent.status)} text-white px-3 py-1 rounded-full text-sm font-bold uppercase`}>
                      {getStatusText(selectedEvent.status)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    {selectedEvent.nama_kegiatan}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-amber-400 mb-3">Deskripsi Kegiatan</h4>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {selectedEvent.isi}
                  </p>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center text-amber-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Tanggal</span>
                    </div>
                    <p className="text-white text-sm">{formatDate(selectedEvent.tanggal)}</p>
                  </div>

                  {(selectedEvent.waktu_mulai || selectedEvent.waktu_selesai) && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center text-blue-400 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-semibold text-sm">Waktu</span>
                      </div>
                      <p className="text-white text-sm">
                        {formatTime(selectedEvent.waktu_mulai)}
                        {selectedEvent.waktu_selesai && ` - ${formatTime(selectedEvent.waktu_selesai)}`}
                      </p>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:col-span-2">
                    <div className="flex items-center text-green-400 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Lokasi</span>
                    </div>
                    <p className="text-white text-sm">{selectedEvent.lokasi}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center text-purple-400 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Status</span>
                    </div>
                    <span className={`inline-block bg-gradient-to-r ${getStatusColor(selectedEvent.status)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                      {getStatusText(selectedEvent.status)}
                    </span>
                  </div>

                  {selectedEvent.created_at && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center text-cyan-400 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-semibold text-sm">Dibuat</span>
                      </div>
                      <p className="text-white text-sm">
                        {formatDate(selectedEvent.created_at)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                {selectedEvent.keterangan && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-amber-400 mb-3">Keterangan</h4>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedEvent.keterangan}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
                  >
                    Tutup
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.share && navigator.share.length !== 0) {
                        navigator.share({
                          title: selectedEvent.nama_kegiatan,
                          text: selectedEvent.isi,
                          url: window.location.href,
                        }).catch((error) => {
                          console.log('Error sharing:', error);
                          // Fallback to clipboard
                          navigator.clipboard.writeText(
                            `${selectedEvent.nama_kegiatan}\n${selectedEvent.isi}\nTanggal: ${formatDate(selectedEvent.tanggal)}\nLokasi: ${selectedEvent.lokasi}`
                          );
                        });
                      } else {
                        // Fallback copy to clipboard
                        navigator.clipboard.writeText(
                          `${selectedEvent.nama_kegiatan}\n${selectedEvent.isi}\nTanggal: ${formatDate(selectedEvent.tanggal)}\nLokasi: ${selectedEvent.lokasi}`
                        ).then(() => {
                          alert('Informasi acara telah disalin ke clipboard!');
                        }).catch((error) => {
                          console.error('Error copying to clipboard:', error);
                        });
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Bagikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsSection;