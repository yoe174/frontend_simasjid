"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithToken } from "@/services/auth";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function EditReservasiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = searchParams.get("id");
  const normalizeTime = (time: string) => time ? time.slice(0, 5) : null;


  const [form, setForm] = useState({
    nama_pemesan: "",
    kontak_pemesan: "",
    tempat_reservasi_id: "",
    nama_acara: "",
    tanggal_acara: "",
    waktu_mulai: "",
    waktu_selesai: "",
    jumlah_tamu: "",
    keterangan: "",
    status_reservasi: "",
  });

  const [tempatOptions, setTempatOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [statusOptions] = useState([
    { value: "dijadwalkan", label: "dijadwalkan" },
    { value: "dilaksanakan", label: "dilaksanakan" },
    { value: "selesai", label: "selesai" },
    { value: "batal", label: "batal" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data tempat untuk dropdown
  useEffect(() => {
    const fetchTempat = async () => {
      try {
        const data = await fetchWithToken("/api/tempatReservasi");
        if (Array.isArray(data)) {
          const options = data.map((item: any) => ({
            value: item.tempat_reservasi_id.toString(),
            label: item.lokasi,
          }));
          setTempatOptions(options);
        }
      } catch (err) {
        console.error("Gagal ambil data tempat:", err);
      }
    };
    fetchTempat();
  }, []);

  // Ambil data reservasi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithToken(`/api/reservasi/${params.id}`);
        setForm({
          nama_pemesan: data.nama_pemesan || "",
          kontak_pemesan: data.kontak_pemesan || "",
          tempat_reservasi_id: data.tempat_reservasi_id?.toString() || "",
          nama_acara: data.nama_acara || "",
          tanggal_acara: data.tanggal_acara || "",
          waktu_mulai: data.waktu_mulai || "",
          waktu_selesai: data.waktu_selesai || "",
          jumlah_tamu: data.jumlah_tamu?.toString() || "",
          keterangan: data.keterangan || "",
          status_reservasi: data.status_reservasi || "",
        });
      } catch (err) {
        console.error("Gagal ambil data reservasi:", err);
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

    if (!form.nama_pemesan || !form.kontak_pemesan || !form.tempat_reservasi_id || !form.nama_acara || !form.tanggal_acara) {
      setError("Field wajib bertanda * harus diisi.");
      setLoading(false);
      return;
    }

    try {
      await fetchWithToken(`/api/reservasi/${params.id}`, {
        method: "PUT",
        // body: JSON.stringify(form),
        body: JSON.stringify({
          ...form,
          waktu_mulai: normalizeTime(form.waktu_mulai),
          waktu_selesai: normalizeTime(form.waktu_selesai),
        }),
      });
      router.push("/admin/reservasi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Reservasi" mapName="Edit Reservasi" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Reservasi" className="!p-6.5 space-y-5.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup 
                type="text" 
                placeholder="Nama Pemesan" 
                label="Nama Pemesan" 
                name="nama_pemesan" 
                value={form.nama_pemesan} 
                onChange={handleChange} 
                required />
              <InputGroup 
                type="text" 
                placeholder="Kontak Pemesan" 
                label="Kontak Pemesan" 
                name="kontak_pemesan" 
                value={form.kontak_pemesan} 
                onChange={handleChange} 
                required />
              <Select 
                label="Tempat Reservasi" 
                placeholder="Pilih tempat" 
                value={form.tempat_reservasi_id} 
                onChange={(e) =>
                  setForm({ ...form, tempat_reservasi_id: e.target.value })
                } 
                items={tempatOptions} />
              <InputGroup 
                type="text" 
                placeholder="Nama Acara" 
                label="Nama Acara" 
                name="nama_acara" 
                value={form.nama_acara} 
                onChange={handleChange} 
                required />
              <InputGroup 
                type="date"
                placeholder=""
                label="Tanggal Acara" 
                name="tanggal_acara" 
                value={form.tanggal_acara} 
                onChange={handleChange} 
                required />
              <InputGroup 
                type="number" 
                placeholder="Jumlah Tamu"
                label="Jumlah Tamu" 
                name="jumlah_tamu" 
                value={form.jumlah_tamu} 
                onChange={handleChange} />
              <InputGroup 
                type="time"
                placeholder=""
                label="Waktu Mulai" 
                name="waktu_mulai"  
                value={form.waktu_mulai} 
                onChange={handleChange} />
              <InputGroup 
                type="time" 
                placeholder=""
                label="Waktu Selesai" 
                name="waktu_selesai" 
                value={form.waktu_selesai} 
                onChange={handleChange} />
              <Select 
                label="Status"
                placeholder="Pilih Status" 
                value={form.status_reservasi} 
                onChange={(e) =>
                  setForm({ ...form, status_reservasi: e.target.value })
                } 
                items={statusOptions} />
            </div>
            <TextAreaGroup
              placeholder="Keterangan Tambahan" 
              label="Keterangan" 
              name="keterangan" 
              value={form.keterangan} 
              onChange={handleChange} />
          </ShowcaseSection>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button type="submit" disabled={loading} className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
