'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  lokasi: string;
  kapasitas: string;
  keterangan: string;
  biaya: string;
  image: File | null;
}

const Create: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    lokasi: '',
    kapasitas: '',
    keterangan: '',
    biaya: '',
    image: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('lokasi', formData.lokasi);
      formDataToSend.append('kapasitas', formData.kapasitas);
      formDataToSend.append('keterangan', formData.keterangan);
      formDataToSend.append('biaya', formData.biaya);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Tempat reservasi berhasil ditambahkan!');
        router.push('/admin/tempat_reservasi');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Gagal menambahkan data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Tempat Reservasi</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi *
            </label>
            <input
              type="text"
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan lokasi tempat reservasi"
            />
          </div>

          <div>
            <label htmlFor="kapasitas" className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas
            </label>
            <input
              type="number"
              id="kapasitas"
              name="kapasitas"
              value={formData.kapasitas}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kapasitas"
            />
          </div>

          <div>
            <label htmlFor="biaya" className="block text-sm font-medium text-gray-700 mb-2">
              Biaya
            </label>
            <input
              type="number"
              id="biaya"
              name="biaya"
              value={formData.biaya}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan biaya"
            />
          </div>

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
              placeholder="Masukkan keterangan tambahan"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Gambar
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Format yang didukung: JPEG, PNG, JPG, GIF (Max: 2MB)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/tempat_reservasi')}
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

export default Create;