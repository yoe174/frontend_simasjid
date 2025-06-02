// src/components/informasi/InformasiEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
// import TextArea from "@/components/FormElements/TextArea";
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

  // Ambil data berdasarkan ID
  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi/${id}`);
        const data = await res.json();

        setForm({
          judul: data.judul,
          isi: data.isi,
          status: data.status,
          keterangan: data.keterangan ?? "",
        });

        setGambarPreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/informasi/${data.image}`);
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
      if (gambar) formData.append("image", gambar);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi/${id}`, {
        method: "POST", // Laravel expects POST with _method=PUT for multipart
        body: (() => {
          formData.append("_method", "PUT");
          return formData;
        })(),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Gagal mengupdate informasi");
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
      <Breadcrumb pageName="Edit Informasi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Edit Informasi" className="space-y-5.5 !p-6.5">
              <InputGroup
                label="Judul"
                name="judul"
                placeholder="Masukkan judul"
                type="text"
                value={form.judul}
                onChange={handleChange}
                required
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Isi
                </label>
                <textarea
                  name="isi"
                  placeholder="Isi informasi"
                  value={form.isi}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke bg-white px-4 py-2.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  rows={6}
                  required
                ></textarea>
              </div>
              {/* <TextArea
                label="Isi"
                name="isi"
                placeholder="Masukkan isi informasi"
                value={form.isi}
                onChange={handleChange}
                required
              /> */}
              <Select
                label="Status"
                placeholder=""
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                items={[
                  { value: "aktif", label: "Aktif" },
                  { value: "nonaktif", label: "Nonaktif" },
                ]}
              />
              <InputGroup
                label="Keterangan"
                name="keterangan"
                placeholder="Keterangan tambahan"
                type="text"
                value={form.keterangan}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="block font-medium text-dark dark:text-white">
                  Gambar
                </label>
                {gambarPreview && (
                  <img
                    src={gambarPreview}
                    alt="Preview"
                    className="w-32 h-auto rounded shadow"
                  />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </ShowcaseSection>
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </>
  );
}
