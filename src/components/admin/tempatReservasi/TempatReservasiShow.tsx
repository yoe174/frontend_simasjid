'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface TempatReservasi {
  tempat_reservasi_id: number;
  lokasi: string;
  kapasitas: number | null;
  keterangan: string | null;
  biaya: number | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Tidak perlu ShowProps lagi
const Show: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Ambil ID dari URL parameter
  
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TempatReservasi | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        alert('Data tidak ditemukan');
        router.push('/admin/tempat_reservasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus tempat reservasi ini?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Tempat reservasi berhasil dihapus!');
        router.push('/admin/tempat_reservasi');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Gagal menghapus data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">ID tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Data tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Detail Tempat Reservasi</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/tempat_reservasi/edit/${id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
              <button
                onClick={() => router.push('/admin/tempat_reservasi')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Umum</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ID</label>
                    <p className="text-gray-900 font-medium">#{data.tempat_reservasi_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Lokasi</label>
                    <p className="text-gray-900 font-medium">{data.lokasi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Kapasitas</label>
                    <p className="text-gray-900 font-medium">
                      {data.kapasitas ? `${data.kapasitas} orang` : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Biaya</label>
                    <p className="text-gray-900 font-medium">{formatCurrency(data.biaya)}</p>
                  </div>
                </div>
              </div>

              {data.keterangan && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Keterangan</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {data.keterangan}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Sistem</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dibuat</label>
                    <p className="text-gray-700 text-sm">{formatDate(data.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Terakhir Diupdate</label>
                    <p className="text-gray-700 text-sm">{formatDate(data.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Gambar</h2>
                {data.image ? (
                  <div className="space-y-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${data.image}`}
                      alt={data.lokasi}
                      className="w-full h-64 object-cover rounded-lg border shadow-sm"
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Gambar tempat reservasi: {data.lokasi}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Tidak ada gambar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;