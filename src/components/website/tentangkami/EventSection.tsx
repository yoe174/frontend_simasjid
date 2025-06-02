'use client';

import { useState, useEffect } from "react";
import { X, Calendar, Info, FileText, Image as ImageIcon } from "lucide-react";

interface InformasiData {
  informasi_id: number;
  judul: string;
  isi: string;
  status: string;
  image: string | null;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
}

const InformasiSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInformasi, setSelectedInformasi] = useState<InformasiData | null>(null);
  const [informasiData, setInformasiData] = useState<InformasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/informasi');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data informasi');
        }
        
        const data = await response.json();
        
        // Filter hanya informasi dengan status 'aktif'
        const activeInformasi = data.filter((item: InformasiData) => item.status === 'aktif');
        
        setInformasiData(activeInformasi);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        console.error('Error fetching informasi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInformasi();
  }, []);

  const openModal = (informasi: InformasiData) => {
    setSelectedInformasi(informasi);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedInformasi(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzM0MTU1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGlkYWsgQWRhIEdhbWJhcjwvdGV4dD4KPC9zdmc+'; // Fallback image
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Memuat informasi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6 flex items-center justify-center">
        <div className="text-center bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-red-400 text-xl font-bold mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-300">{error}</p>
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
            Informasi Terkini
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Berita dan informasi terbaru dari komunitas kami
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-pink-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* No data message */}
        {informasiData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-gray-300 text-xl font-bold mb-2">Belum Ada Informasi</h3>
            <p className="text-gray-400">Informasi akan ditampilkan di sini ketika tersedia</p>
          </div>
        )}

        {/* Informasi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {informasiData.map((informasi) => (
            <div
              key={informasi.informasi_id}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-105"
            >
              {/* Image container with overlay */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img
                  src={getImageUrl(informasi.image)}
                  alt={informasi.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/image/default-info.jpg';
                  }}
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    TERBARU
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
                  {informasi.judul}
                </h3>
                
                {informasi.keterangan && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {informasi.keterangan}
                  </p>
                )}

                {/* Quick info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400 text-xs">
                    <Calendar className="w-3 h-3 mr-2" />
                    <span>{formatDate(informasi.created_at)}</span>
                  </div>
                  {informasi.keterangan && (
                    <div className="flex items-center text-gray-400 text-xs">
                      <Info className="w-3 h-3 mr-2" />
                      <span className="line-clamp-1">{informasi.keterangan}</span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  onClick={() => openModal(informasi)}
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
      </div>

      {/* Enhanced Modal */}
      {isOpen && selectedInformasi && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20">
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
                  src={getImageUrl(selectedInformasi.image)}
                  alt={selectedInformasi.judul}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/image/default-info.jpg';
                  }}
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedInformasi.judul}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Keterangan */}
                {selectedInformasi.keterangan && (
                  <div className="mb-6">
                    <div className="flex items-center text-amber-400 mb-3">
                      <Info className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Keterangan</span>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10">
                      {selectedInformasi.keterangan}
                    </p>
                  </div>
                )}

                {/* Isi Content */}
                <div className="mb-6">
                  <div className="flex items-center text-blue-400 mb-3">
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Detail Informasi</span>
                  </div>
                  <div className="text-gray-300 text-base leading-relaxed bg-white/5 rounded-xl p-6 border border-white/10">
                    <div dangerouslySetInnerHTML={{ __html: selectedInformasi.isi }} />
                  </div>
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center text-green-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Tanggal Dibuat</span>
                    </div>
                    <p className="text-white text-sm">{formatDate(selectedInformasi.created_at)}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center text-purple-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">Terakhir Diperbarui</span>
                    </div>
                    <p className="text-white text-sm">{formatDate(selectedInformasi.updated_at)}</p>
                  </div>
                </div>

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
                      if (navigator.share) {
                        navigator.share({
                          title: selectedInformasi.judul,
                          text: selectedInformasi.keterangan || selectedInformasi.judul,
                          url: window.location.href
                        });
                      } else {
                        // Fallback copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link berhasil disalin!');
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

export default InformasiSection;