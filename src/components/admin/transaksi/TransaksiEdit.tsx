// src\components\admin\transaksi\TransaksiEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithToken } from "@/services/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function TransaksiEditPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    kategori: "",
    jenis_transaksi_id: "",
    nominal: "",
    sumber: "",
    status: "",
    keterangan: "",
  });

  const [jenisTransaksiOptions, setJenisTransaksiOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data dropdown jenis transaksi
  useEffect(() => {
    const fetchJenisTransaksi = async () => {
      try {
        const data = await fetchWithToken(`/api/jenis_transaksi`);
        const options = data.map((item: any) => ({
          value: item.jenis_transaksi_id.toString(),
          label: item.jenis_name,
        }));
        setJenisTransaksiOptions(options);
      } catch (err) {
        console.error("Gagal ambil jenis transaksi:", err);
      }
    };

    fetchJenisTransaksi();
  }, []);

  // Ambil data transaksi berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithToken(`/api/transaksi/${params.id}`);
        setForm({
          kategori: data.kategori || "",
          jenis_transaksi_id: data.jenis_transaksi_id?.toString() || "",
          nominal: data.nominal?.toString() || "",
          sumber: data.sumber || "",
          status: data.status || "draft",
          keterangan: data.keterangan || "",
        });
      } catch (err) {
        console.error("Gagal ambil data transaksi:", err);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.kategori || !form.jenis_transaksi_id || !form.nominal || !form.status) {
      setError("Semua field bertanda * wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      await fetchWithToken(`/api/transaksi/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          nominal: parseFloat(form.nominal),
        }),
      });

      router.push("/admin/transaksi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Transaksi" mapName="Edit Transaksi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Transaksi" className="!p-6.5 space-y-5.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                onChange={(e) => setForm({ ...form, jenis_transaksi_id: e.target.value })}
                items={jenisTransaksiOptions}
              />
                <Select
                label="Status"
                placeholder="Pilih Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                items={[
                  { value: "draft", label: "draft" },
                  { value: "valid", label: "valid" },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Nominal"
                name="nominal"
                type="number"
                placeholder="Masukkan nominal"
                value={form.nominal}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Sumber"
                name="sumber"
                type="text"
                placeholder="-"
                value={form.sumber}
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
