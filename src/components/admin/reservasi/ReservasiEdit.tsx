'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface TempatReservasi {
  tempat_reservasi_id: number;
  nama_tempat: string;
  lokasi: string;
  kapasitas: number | null;
  keterangan: string | null;
  biaya: number | null;
  image: string | null;
}

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
  status_reservasi: string;
  mengetahui: string | null;
  keterangan: string | null;
  tempatReservasi?: TempatReservasi;
}

interface FormData {
  nama_pemesan: string;
  kontak_pemesan: string;
  tempat_reservasi_id: string;
  nama_acara: string;
  tanggal_acara: string;
  waktu_mulai: string;
  waktu_selesai: string;
  jumlah_tamu: string;
  status_reservasi: string;
  mengetahui: string;
  keterangan: string;
}

const EditReservasi: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Ambil ID dari URL parameter
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [data, setData] = useState<Reservasi | null>(null);
  const [tempatReservasi, setTempatReservasi] = useState<TempatReservasi[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nama_pemesan: '',
    kontak_pemesan: '',
    tempat_reservasi_id: '',
    nama_acara: '',
    tanggal_acara: '',
    waktu_mulai: '',
    waktu_selesai: '',
    jumlah_tamu: '',
    status_reservasi: 'menunggu',
    mengetahui: '',
    keterangan: ''
  });

  useEffect(() => {
    if (id) {
      fetchData();
      fetchTempatReservasi();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFormData({
          nama_pemesan: result.nama_pemesan || '',
          kontak_pemesan: result.kontak_pemesan || '',
          tempat_reservasi_id: result.tempat_reservasi_id?.toString() || '',
          nama_acara: result.nama_acara || '',
          tanggal_acara: result.tanggal_acara ? result.tanggal_acara.split('T')[0] : '',
          waktu_mulai: result.waktu_mulai || '',
          waktu_selesai: result.waktu_selesai || '',
          jumlah_tamu: result.jumlah_tamu?.toString() || '',
          status_reservasi: result.status_reservasi || 'menunggu',
          mengetahui: result.mengetahui || '',
          keterangan: result.keterangan || ''
        });
      } else {
        alert('Data tidak ditemukan');
        router.push('/admin/reservasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchTempatReservasi = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi`);
      if (response.ok) {
        const result = await response.json();
        setTempatReservasi(Array.isArray(result) ? result : result.data || []);
      }
    } catch (error) {
      console.error('Error fetching tempat reservasi:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        nama_pemesan: formData.nama_pemesan,
        kontak_pemesan: formData.kontak_pemesan,
        tempat_reservasi_id: parseInt(formData.tempat_reservasi_id),
        nama_acara: formData.nama_acara,
        tanggal_acara: formData.tanggal_acara,
        waktu_mulai: formData.waktu_mulai || null,
        waktu_selesai: formData.waktu_selesai || null,
        jumlah_tamu: formData.jumlah_tamu ? parseInt(formData.jumlah_tamu) : null,
        status_reservasi: formData.status_reservasi,
        mengetahui: formData.mengetahui || null,
        keterangan: formData.keterangan || null
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        alert('Reservasi berhasil diperbarui!');
        router.push('/admin/reservasi');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Gagal memperbarui data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  // Cek jika ID tidak ada
  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">ID tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Reservasi</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Pemesan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama_pemesan" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pemesan *
              </label>
              <input
                type="text"
                id="nama_pemesan"
                name="nama_pemesan"
                value={formData.nama_pemesan}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama pemesan"
              />
            </div>

            <div>
              <label htmlFor="kontak_pemesan" className="block text-sm font-medium text-gray-700 mb-2">
                Kontak Pemesan *
              </label>
              <input
                type="text"
                id="kontak_pemesan"
                name="kontak_pemesan"
                value={formData.kontak_pemesan}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nomor telepon atau email"
              />
            </div>
          </div>

          {/* Data Acara */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama_acara" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Acara *
              </label>
              <input
                type="text"
                id="nama_acara"
                name="nama_acara"
                value={formData.nama_acara}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama acara"
              />
            </div>

            <div>
              <label htmlFor="tempat_reservasi_id" className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Reservasi *
              </label>
              <select
                id="tempat_reservasi_id"
                name="tempat_reservasi_id"
                value={formData.tempat_reservasi_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih tempat reservasi</option>
                {tempatReservasi.map((tempat) => (
                  <option key={tempat.tempat_reservasi_id} value={tempat.tempat_reservasi_id}>
                    {tempat.nama_tempat || tempat.lokasi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal dan Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tanggal_acara" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Acara *
              </label>
              <input
                type="date"
                id="tanggal_acara"
                name="tanggal_acara"
                value={formData.tanggal_acara}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="waktu_mulai" className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Mulai
              </label>
              <input
                type="time"
                id="waktu_mulai"
                name="waktu_mulai"
                value={formData.waktu_mulai}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="waktu_selesai" className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Selesai
              </label>
              <input
                type="time"
                id="waktu_selesai"
                name="waktu_selesai"
                value={formData.waktu_selesai}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Detail Acara */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jumlah_tamu" className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Tamu
              </label>
              <input
                type="number"
                id="jumlah_tamu"
                name="jumlah_tamu"
                value={formData.jumlah_tamu}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan jumlah tamu"
              />
            </div>

            <div>
              <label htmlFor="mengetahui" className="block text-sm font-medium text-gray-700 mb-2">
                Mengetahui
              </label>
              <input
                type="text"
                id="mengetahui"
                name="mengetahui"
                value={formData.mengetahui}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama pihak yang mengetahui"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status_reservasi" className="block text-sm font-medium text-gray-700 mb-2">
              Status Reservasi *
            </label>
            <select
              id="status_reservasi"
              name="status_reservasi"
              value={formData.status_reservasi}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="menunggu">Menunggu</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="dilaksanakan">Dilaksanakan</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Keterangan tambahan (opsional)"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/reservasi')}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservasi;