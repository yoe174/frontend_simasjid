"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function EditTempatReservasiPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    lokasi: "",
    kapasitas: "",
    biaya: "",
    keterangan: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hapusGambar, setHapusGambar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal mengambil data");

        setForm({
          lokasi: data.lokasi,
          kapasitas: data.kapasitas,
          biaya: data.biaya,
          keterangan: data.keterangan ?? "",
        });

        if (data.image) {
          setPreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/${data.image}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      }
    };

    if (id) fetchData();
  }, [id]);

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
      setHapusGambar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("lokasi", form.lokasi);
      formData.append("kapasitas", form.kapasitas);
      formData.append("biaya", form.biaya);
      formData.append("keterangan", form.keterangan);
      if (hapusGambar) formData.append("hapus_gambar", "1");
      if (image) formData.append("image", image);
      formData.append("_method", "PUT"); // Untuk Laravel

      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengupdate data");

      router.push("/admin/tempat_reservasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Tempat Reservasi" mapName="Edit" />

      <form onSubmit={handleSubmit} className="space-y-9">
        <ShowcaseSection title="Form Edit Tempat Reservasi" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="Lokasi"
              name="lokasi"
              placeholder="Lokasi"
              type="text"
              value={form.lokasi}
              onChange={handleChange}
              required
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
            {preview && !hapusGambar && (
              <div className="mt-4 space-y-2">
                <img src={preview} alt="Preview" className="w-40 rounded shadow" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                    setHapusGambar(true);
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
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-6 py-3 text-white"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
