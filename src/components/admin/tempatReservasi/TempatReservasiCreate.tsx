"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function CreateTempatReservasiPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    lokasi: "",
    kapasitas: "",
    biaya: "",
    keterangan: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.lokasi) {
      setError("Kolom lokasi, kapasitas, dan biaya wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("lokasi", form.lokasi);
      data.append("kapasitas", form.kapasitas);
      data.append("biaya", form.biaya);
      data.append("keterangan", form.keterangan);
      if (image) data.append("image", image);

      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menambahkan tempat");

      router.push("/admin/tempat_reservasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Tempat Reservasi" mapName="Create" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <ShowcaseSection title="Form Tempat Reservasi" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup 
              label="Lokasi" 
              name="lokasi"
              placeholder="Lokasi" 
              type="text"
              value={form.lokasi} 
              onChange={handleChange} required 
            />
            <InputGroup 
              label="Kapasitas" 
              name="kapasitas"
              placeholder="Kapasitas" 
              type="number"
              value={form.kapasitas} 
              onChange={handleChange}
            />
            <InputGroup 
              label="Biaya" 
              name="biaya" 
              placeholder="Biaya" 
              type="number"
              value={form.biaya} 
              onChange={handleChange}
            />
          </div>

          <TextAreaGroup
            label="Keterangan"
            name="keterangan"
            placeholder="Keterangan tambahan"
            value={form.keterangan}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Upload Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
            />
            {preview && (
              <div className="mt-4 space-y-2">
                <img src={preview} alt="Preview" className="w-40 rounded shadow" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Hapus Gambar
                </button>
              </div>
            )}
          </div>
        </ShowcaseSection>

        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="rounded bg-primary px-6 py-3 text-white">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
