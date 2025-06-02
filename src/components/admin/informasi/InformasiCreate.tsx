"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function CreateInformasiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    status: "aktif",
    keterangan: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi
    if (!form.judul || !form.isi || !form.status) {
      setError("Judul, Isi, dan Status wajib diisi.");
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi`, {
        method: "POST",
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
      <Breadcrumb pageName="Create Informasi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Form Informasi" className="space-y-5.5 !p-6.5">
              <InputGroup
                label="Judul"
                name="judul"
                placeholder="Judul informasi"
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

              <Select
                label="Status"
                placeholder="Pilih Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                items={[
                  { value: "aktif", label: "Aktif" },
                  { value: "arsip", label: "Arsip" },
                ]}
              />

              {/* <InputGroup
                label="Keterangan (opsional)"
                name="keterangan"
                placeholder="Keterangan tambahan"
                type="text"
                value={form.keterangan}
                onChange={handleChange}
              /> */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  placeholder="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke bg-white px-4 py-2.5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  rows={6}
                  required
                ></textarea>
              </div>

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
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
