// src/components/informasi/InformasiEdit.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function EditInformasiPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    status: "",
    keterangan: "",
  });

  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hapusGambar, setHapusGambar] = useState(false);

  // Ambil data berdasarkan ID
  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        const data = await fetchWithToken(`/api/informasi/${id}`);

        setForm({
          judul: data.judul,
          isi: data.isi,
          status: data.status.toLowerCase(), // Pastikan cocok
          keterangan: data.keterangan ?? "",
        });

        if (data.image) {
          setGambarPreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/${data.image}`);
        }
      } catch (err) {
        console.error("Gagal ambil data informasi:", err);
      }
    };

    if (id) fetchInformasi();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambar(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("judul", form.judul);
      formData.append("isi", form.isi);
      formData.append("status", form.status);
      formData.append("keterangan", form.keterangan);
      if (hapusGambar) {
        formData.append("hapus_gambar", "1"); // server cek untuk hapus
      }
      if (gambar) formData.append("image", gambar);
      formData.append("_method", "PUT"); // Laravel expects PUT via POST

      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi/${id}`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type karena browser akan atur otomatis untuk FormData
      },
        body: formData,
      });

      const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Gagal mengupdate informasi");


      router.push("/admin/informasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Informasi" mapName="Edit Informasi" />

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

            {/* Row 3: Upload Gambar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Upload Gambar
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white dark:border-gray-600 dark:bg-gray-700"
                />
                {gambarPreview && !hapusGambar && (
                  <div className="mt-4 space-y-2">
                    <img
                      src={gambarPreview}
                      alt="Preview"
                      className="w-40 h-auto rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setHapusGambar(true);
                        setGambar(null);
                        setGambarPreview(null);
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
