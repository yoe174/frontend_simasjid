'use client';

import React, { useState, useEffect } from 'react';

interface TempatReservasi {
  tempat_reservasi_id: number;
  lokasi: string;
}

interface CreateReservasiProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateReservasi: React.FC<CreateReservasiProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
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
    keterangan: '',
  });

  const [tempatReservasiList, setTempatReservasiList] = useState<TempatReservasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchTempatReservasi();
  }, []);

  const fetchTempatReservasi = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/tempatReservasi`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Handle different response structures
        if (Array.isArray(data)) {
          setTempatReservasiList(data);
        } else if (data.data && Array.isArray(data.data)) {
          setTempatReservasiList(data.data);
        } else if (data.tempat_reservasi && Array.isArray(data.tempat_reservasi)) {
          setTempatReservasiList(data.tempat_reservasi);
        } else {
          console.error('Unexpected data structure:', data);
          setTempatReservasiList([]);
        }
      } else {
        console.error('Failed to fetch tempat reservasi:', response.status);
        setTempatReservasiList([]);
      }
    } catch (error) {
      console.error('Error fetching tempat reservasi:', error);
      setTempatReservasiList([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTimeForBackend = (timeString: string): string => {
    if (!timeString) return '';
    if (timeString.includes(':') && timeString.split(':').length === 3) {
      return timeString;
    }
    return timeString + ':00';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    const payload = {
      ...formData,
      tempat_reservasi_id: parseInt(formData.tempat_reservasi_id),
      jumlah_tamu: formData.jumlah_tamu ? parseFloat(formData.jumlah_tamu) : null,
      waktu_mulai: formatTimeForBackend(formData.waktu_mulai),
      waktu_selesai: formatTimeForBackend(formData.waktu_selesai),
    };

    try {
      const response = await fetch(`${apiUrl}/api/reservasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Reservasi berhasil dibuat!');
        
        // Reset form
        setFormData({
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
          keterangan: '',
        });
        
        if (onSuccess) onSuccess();
      } else {
        const errorText = await response.text();
        
        try {
          const errorData = JSON.parse(errorText);
          setErrors(errorData.errors || {});
          alert('Gagal membuat reservasi: ' + (errorData.message || 'Unknown error'));
        } catch {
          alert('Gagal membuat reservasi: ' + response.statusText);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Terjadi kesalahan jaringan: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Tambah Reservasi Baru</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pemesan *
            </label>
            <input
              type="text"
              name="nama_pemesan"
              value={formData.nama_pemesan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.nama_pemesan && <p className="text-red-500 text-sm mt-1">{errors.nama_pemesan[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kontak Pemesan *
            </label>
            <input
              type="text"
              name="kontak_pemesan"
              value={formData.kontak_pemesan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.kontak_pemesan && <p className="text-red-500 text-sm mt-1">{errors.kontak_pemesan[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempat Reservasi *
            </label>
            <select
              name="tempat_reservasi_id"
              value={formData.tempat_reservasi_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Tempat Reservasi</option>
              {tempatReservasiList.map((tempat) => (
                <option key={tempat.tempat_reservasi_id} value={tempat.tempat_reservasi_id}>
                  {tempat.lokasi}
                </option>
              ))}
            </select>
            {errors.tempat_reservasi_id && <p className="text-red-500 text-sm mt-1">{errors.tempat_reservasi_id[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Acara *
            </label>
            <input
              type="text"
              name="nama_acara"
              value={formData.nama_acara}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.nama_acara && <p className="text-red-500 text-sm mt-1">{errors.nama_acara[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Acara *
            </label>
            <input
              type="date"
              name="tanggal_acara"
              value={formData.tanggal_acara}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.tanggal_acara && <p className="text-red-500 text-sm mt-1">{errors.tanggal_acara[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Mulai
            </label>
            <input
              type="time"
              name="waktu_mulai"
              value={formData.waktu_mulai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.waktu_mulai && <p className="text-red-500 text-sm mt-1">{errors.waktu_mulai[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Selesai
            </label>
            <input
              type="time"
              name="waktu_selesai"
              value={formData.waktu_selesai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.waktu_selesai && <p className="text-red-500 text-sm mt-1">{errors.waktu_selesai[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Tamu
            </label>
            <input
              type="number"
              name="jumlah_tamu"
              value={formData.jumlah_tamu}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.jumlah_tamu && <p className="text-red-500 text-sm mt-1">{errors.jumlah_tamu[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Reservasi *
            </label>
            <select
              name="status_reservasi"
              value={formData.status_reservasi}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="menunggu">Menunggu</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="dilaksanakan">Dilaksanakan</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
            </select>
            {errors.status_reservasi && <p className="text-red-500 text-sm mt-1">{errors.status_reservasi[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mengetahui
            </label>
            <input
              type="text"
              name="mengetahui"
              value={formData.mengetahui}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mengetahui && <p className="text-red-500 text-sm mt-1">{errors.mengetahui[0]}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keterangan
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.keterangan && <p className="text-red-500 text-sm mt-1">{errors.keterangan[0]}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateReservasi;