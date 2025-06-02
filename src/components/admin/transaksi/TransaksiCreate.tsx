"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import TextAreaGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

type JenisTransaksi = {
  jenis_transaksi_id: number;
  jenis_name: string;
};

export default function CreateTransaksiPage() {
  const router = useRouter();
  const [jenisList, setJenisList] = useState<JenisTransaksi[]>([]);
  const [form, setForm] = useState({
    kategori: "",
    jenis_transaksi_id: "",
    nominal: "",
    sumber: "",
    mengetahui: "",
    status: "draft",
    keterangan: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJenis = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis_transaksi`);
        const data = await res.json();
        setJenisList(data ?? []);
        console.log("data" , data)
      } catch (err) {
        console.error("Gagal ambil data jenis transaksi:", err);
      }
    };
    fetchJenis();
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

    const { kategori, jenis_transaksi_id, nominal, mengetahui } = form;

    if (!kategori || !jenis_transaksi_id || !nominal || !mengetahui) {
      setError("Field dengan tanda * wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transaksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          nominal: parseFloat(form.nominal),
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Gagal menyimpan transaksi");

      router.push("/admin/transaksi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Create Transaksi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Form Transaksi" className="space-y-5.5 !p-6.5">
              <Select
                label="Kategori"
                placeholder="Pilih kategori"
                className="kategori"
                value={form.kategori}
                onChange={handleChange}
                items={[
                  { value: "pemasukan", label: "Pemasukan" },
                  { value: "pengeluaran", label: "Pengeluaran" },
                ]}
              />

              <Select
                label="Jenis Transaksi"
                placeholder="Pilih jenis transaksi"
                className="jenis_transaksi_id"
                value={form.jenis_transaksi_id}
                // onChange={handleChange}
                onChange={(e) => setForm({ ...form, jenis_transaksi_id: e.target.value })}
                items={jenisList.map((jenis) => ({
                  value: String(jenis.jenis_transaksi_id),
                  label: jenis.jenis_name,
                }))}
              />

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
                placeholder="Misalnya: hamba Allah"
                value={form.sumber}
                onChange={handleChange}
              />

              <InputGroup
                label="Mengetahui *"
                name="mengetahui"
                type="text"
                placeholder="Nama yang mengetahui"
                value={form.mengetahui}
                onChange={handleChange}
                required
              />

              {/* <Select
                label="Status"
                placeholder="Pilih Role"
                value={form.status}
                onChange={handleChange}
                items={[
                  { value: "draft", label: "Draft" },
                  { value: "valid", label: "Valid" },
                ]}
              /> */}

              {/* <TextAreaGroup
                label="Keterangan"
                name="keterangan"
                placeholder="Tuliskan keterangan tambahan"
                value={form.keterangan}
                onChange={handleChange}
              /> */}
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
