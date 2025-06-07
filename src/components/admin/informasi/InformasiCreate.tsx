// src\components\admin\informasi\InformasiCreate.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area"; // Pastikan path-nya benar

export default function CreateInformasiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    status: "",
    keterangan: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!form.judul || !form.isi || !form.status) {
      setError("Kolom bertanda * wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("judul", form.judul);
      data.append("isi", form.isi);
      data.append("status", form.status);
      data.append("keterangan", form.keterangan);
      if (image) data.append("image", image);

      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type karena browser akan atur otomatis untuk FormData
      },
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal menyimpan informasi");
      }

      router.push("/admin/informasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Informasi" mapName="Create Informasi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Form Informasi" className="!p-6.5 space-y-5.5">
            {/* Row 1: Judul & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Judul"
                name="judul"
                placeholder="Judul informasi"
                type="text"
                value={form.judul}
                onChange={handleChange}
                required
              />

              <Select
                label="Status"
                placeholder="Pilih Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                items={[
                  { value: "aktif", label: "aktif" },
                  { value: "arsip", label: "arsip" },
                ]}
              />
            </div>

            {/* Row 2: Isi & Keterangan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextAreaGroup
                label="Isi"
                name="isi"
                placeholder="Isi informasi"
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

            {/* Gambar Upload Full Width */}
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
              {preview && (
                <div className="mt-4 space-y-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-auto rounded shadow"
                  />
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
