// src\components\admin\kegiatan\KegiatanEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import TimePickerAntd from "@/components/FormElements/TimePicker/TimePickerAntd";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function KegiatanEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama_kegiatan: "",
    isi: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    lokasi: "",
    status: "",
    keterangan: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hapusGambar, setHapusGambar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kegiatan/${id}`);
        const data = await res.json();

        setForm({
          nama_kegiatan: data.nama_kegiatan,
          isi: data.isi,
          tanggal: data.tanggal,
          waktu_mulai: data.waktu_mulai,
          waktu_selesai: data.waktu_selesai,
          lokasi: data.lokasi,
          status: data.status,
          keterangan: data.keterangan ?? "",
        });

        if (data.image) {
          setPreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/${data.image}`);
        }
      } catch (err) {
        setError("Gagal mengambil data kegiatan");
      }
    };

    if (id) fetchKegiatan();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (hapusGambar) formData.append("hapus_gambar", "1");
      if (image) formData.append("image", image);
      formData.append("_method", "PUT");

      const token = localStorage.getItem("token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kegiatan/${id}`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type karena browser akan atur otomatis untuk FormData
      },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengupdate kegiatan");

      router.push("/admin/kegiatan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Kegiatan" mapName="Edit Kegiatan" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Form Kegiatan" className="!p-6.5 space-y-5.5">
            {/* Baris 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Nama Kegiatan"
                name="nama_kegiatan"
                placeholder="Masukkan nama kegiatan"
                type="text"
                value={form.nama_kegiatan}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Tanggal"
                name="tanggal"
                placeholder=""
                type="date"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
              {/* <DatePickerOne
                label="Tanggal"
                name="tanggal"
                value={form.tanggal}
                onChange={(name, value) => setForm({ ...form, [name]: value })}
              /> */}
            </div>

            {/* Baris 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                  label="Waktu Mulai"
                  name="waktu_mulai"
                  placeholder=""
                  type="time"
                  value={form.waktu_mulai}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Waktu Selesai"
                  name="waktu_selesai"
                  placeholder=""
                  type="time"
                  value={form.waktu_selesai}
                  onChange={handleChange}
                />              
              {/* <TimePickerAntd
                label="Waktu Mulai"
                name="waktu_mulai"
                value={form.waktu_mulai}
                onChange={(name, value) => setForm({ ...form, [name]: value })}
              />
              <TimePickerAntd
                label="Waktu Selesai"
                name="waktu_selesai"
                value={form.waktu_selesai}
                onChange={(name, value) => setForm({ ...form, [name]: value })}
              /> */}
            </div>

            {/* Baris 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Lokasi"
                name="lokasi"
                type="text"
                placeholder="Masukkan lokasi kegiatan"
                value={form.lokasi}
                onChange={handleChange}
                required
              />
              <Select
                label="Status"
                placeholder="Pilih Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                items={[
                  { value: "dijadwalkan", label: "dijadwalkan" },
                  { value: "dilaksanakan", label: "dilaksanakan" },
                  { value: "selesai", label: "selesai" },
                  { value: "dibatalkan", label: "dibatalkan" },
                ]}
              />
            </div>

            {/* Baris 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextAreaGroup
                label="Isi *"
                name="isi"
                placeholder="Isi kegiatan"
                value={form.isi}
                onChange={handleChange}
                required
              />
              <TextAreaGroup
                label="Keterangan"
                name="keterangan"
                placeholder="Keterangan tambahan"
                value={form.keterangan}
                onChange={handleChange}
              />
            </div>

            {/* Upload Gambar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Upload Gambar
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white dark:border-gray-600 dark:bg-gray-700"
                />
                {preview && !hapusGambar && (
                  <div className="mt-4 space-y-2">
                    <img src={preview} alt="Preview" className="w-40 h-auto rounded shadow" />
                    <button
                      type="button"
                      onClick={() => {
                        setHapusGambar(true);
                        setImage(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>
              <div></div>
            </div>
          </ShowcaseSection>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
