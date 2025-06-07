// src\components\admin\transaksi\TransaksiCreate.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function CreateTransaksiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    kategori: "",
    jenis_transaksi_id: "",
    nominal: "",
    sumber: "",
    keterangan: "",
  });

  const [jenisTransaksiOptions, setJenisTransaksiOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data dropdown jenis_transaksi dari API
  useEffect(() => {
    const fetchJenisTransaksi = async () => {
      try {
        const data = await fetchWithToken(`/api/jenis_transaksi`);
        if (Array.isArray(data)) {
          const options = data.map((item: any) => ({
            value: item.jenis_transaksi_id.toString(),
            label: item.jenis_name,
          }));
          setJenisTransaksiOptions(options);
        } else {
          console.warn("Data bukan array:", data);
        }
      } catch (err) {
        console.error("Gagal mengambil data jenis transaksi:", err);
      }
    };

    fetchJenisTransaksi();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.kategori || !form.jenis_transaksi_id || !form.nominal ) {
      setError("Semua field bertanda * wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      await fetchWithToken(`/api/transaksi`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          nominal: parseFloat(form.nominal),
        }),
      });

      router.push("/admin/transaksi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Transaksi" mapName="Create Transaksi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Form Transaksi" className="!p-6.5 space-y-5.5">
            {/* Kategori & Jenis Transaksi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Kategori"
                placeholder="Pilih Kategori"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                items={[
                  { value: "pemasukan", label: "Pemasukan" },
                  { value: "pengeluaran", label: "Pengeluaran" },
                ]}
              />
              <Select
                label="Jenis Transaksi"
                placeholder="Pilih Jenis"
                value={form.jenis_transaksi_id}
                onChange={(e) =>
                  setForm({ ...form, jenis_transaksi_id: e.target.value })
                }
                items={jenisTransaksiOptions}
              />
            </div>

            {/* Nominal & Sumber */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Nominal"
                name="nominal"
                placeholder="Masukkan nominal"
                type="number"
                value={form.nominal}
                onChange={handleChange}
                required
              />

              <InputGroup
                label="Sumber"
                name="sumber"
                placeholder="Contoh: Infaq, kotak amal, dll"
                type="text"
                value={form.sumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <TextAreaGroup
                label="Keterangan"
                name="keterangan"
                placeholder="Keterangan tambahan"
                value={form.keterangan}
                onChange={handleChange}
              />
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
