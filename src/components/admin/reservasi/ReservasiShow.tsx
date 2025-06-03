'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Reservasi {
  reservasi_id: number;
  nama_pemesan: string;
  kontak_pemesan: string;
  tempat_reservasi_id: number;
  nama_acara: string;
  tanggal_acara: string;
  waktu_mulai: string | null;
  waktu_selesai: string | null;
  jumlah_tamu: number | null;
  status_reservasi: 'menunggu' | 'dikonfirmasi' | 'dijadwalkan' | 'dilaksanakan' | 'selesai' | 'batal';
  mengetahui: string | null;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
  // Relasi data
  tempat_reservasi?: {
    lokasi: string;
    kapasitas: number | null;
    biaya: number | null;
  };
}

const Show: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Ambil ID dari URL parameter
  
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Reservasi | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        alert('Data tidak ditemukan');
        router.push('/admin/reservasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'dikonfirmasi' | 'dijadwalkan' | 'dilaksanakan' | 'selesai' | 'batal') => {
    const statusLabels = {
      dikonfirmasi: 'dikonfirmasi',
      dijadwalkan: 'dijadwalkan', 
      dilaksanakan: 'dilaksanakan',
      selesai: 'diselesaikan',
      batal: 'dibatalkan'
    };

    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${statusLabels[newStatus]}?`)) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_reservasi: newStatus }),
      });

      if (response.ok) {
        alert(`Status reservasi berhasil diubah menjadi ${statusLabels[newStatus]}!`);
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Gagal mengupdate status'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Reservasi berhasil dihapus!');
        router.push('/admin/reservasi');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Gagal menghapus data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5); // Format HH:MM
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      menunggu: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      dikonfirmasi: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dikonfirmasi' },
      dijadwalkan: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Dijadwalkan' },
      dilaksanakan: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Dilaksanakan' },
      selesai: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      batal: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.menunggu;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getAvailableStatusTransitions = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      menunggu: ['dikonfirmasi', 'batal'],
      dikonfirmasi: ['dijadwalkan', 'batal'],
      dijadwalkan: ['dilaksanakan', 'batal'],
      dilaksanakan: ['selesai'],
      selesai: [],
      batal: []
    };

    return transitions[currentStatus] || [];
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
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
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

  const availableTransitions = getAvailableStatusTransitions(data.status_reservasi);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Detail Reservasi</h1>
              <p className="text-blue-100 text-sm">#{data.reservasi_id}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Status Update Buttons */}
              {availableTransitions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status as any)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                    status === 'dikonfirmasi' ? 'bg-blue-500 hover:bg-blue-600' :
                    status === 'dijadwalkan' ? 'bg-purple-500 hover:bg-purple-600' :
                    status === 'dilaksanakan' ? 'bg-orange-500 hover:bg-orange-600' :
                    status === 'selesai' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {updating ? 'Loading...' : 
                   status === 'dikonfirmasi' ? 'Konfirmasi' :
                   status === 'dijadwalkan' ? 'Jadwalkan' :
                   status === 'dilaksanakan' ? 'Laksanakan' :
                   status === 'selesai' ? 'Selesaikan' :
                   'Batalkan'
                  }
                </button>
              ))}
              
              {/* Action Buttons */}
              <button
                onClick={() => router.push(`/admin/reservasi/edit/${id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={updating}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Menghapus...' : 'Hapus'}
              </button>
              <button
                onClick={() => router.push('/admin/reservasi')}
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
            {/* Informasi Reservasi */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Reservasi</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(data.status_reservasi)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nama Acara</label>
                    <p className="text-gray-900 font-medium">{data.nama_acara}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tanggal Acara</label>
                    <p className="text-gray-900 font-medium">{formatDate(data.tanggal_acara)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Waktu Mulai</label>
                      <p className="text-gray-900 font-medium">{formatTime(data.waktu_mulai)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Waktu Selesai</label>
                      <p className="text-gray-900 font-medium">{formatTime(data.waktu_selesai)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Jumlah Tamu</label>
                    <p className="text-gray-900 font-medium">{data.jumlah_tamu ? `${data.jumlah_tamu} orang` : '-'}</p>
                  </div>
                  {data.mengetahui && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Mengetahui</label>
                      <p className="text-gray-900 font-medium">{data.mengetahui}</p>
                    </div>
                  )}
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
            </div>

            {/* Informasi Pemesan & Tempat */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pemesan</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nama Pemesan</label>
                    <p className="text-gray-900 font-medium">{data.nama_pemesan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Kontak</label>
                    <p className="text-gray-900 font-medium">{data.kontak_pemesan}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Tempat</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Lokasi</label>
                    <p className="text-gray-900 font-medium">
                      {data.tempat_reservasi?.lokasi || `Tempat ID: ${data.tempat_reservasi_id}`}
                    </p>
                  </div>
                  {data.tempat_reservasi?.kapasitas && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kapasitas</label>
                      <p className="text-gray-900 font-medium">{data.tempat_reservasi.kapasitas} orang</p>
                    </div>
                  )}
                  {data.tempat_reservasi?.biaya && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Biaya</label>
                      <p className="text-gray-900 font-medium">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(data.tempat_reservasi.biaya)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Sistem</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dibuat</label>
                    <p className="text-gray-700 text-sm">{formatDateTime(data.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Terakhir Diupdate</label>
                    <p className="text-gray-700 text-sm">{formatDateTime(data.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;