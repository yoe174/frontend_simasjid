// src/components/admin/reservasi/ReservasiShow.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

const formatTanggal = (tgl: string) => new Date(tgl).toLocaleDateString("id-ID", {
  day: "2-digit", month: "long", year: "numeric"
});

type Reservasi = {
  reservasi_id: number;
  nama_pemesan: string;
  kontak_pemesan: string;
  tempat_reservasi?: {
    lokasi: string;
  };
  nama_acara: string;
  tanggal_acara: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  jumlah_tamu?: number;
  status_reservasi: string;
  mengetahui?: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
};

export default function ShowReservasiPage() {
  const { id } = useParams();
  const [data, setData] = useState<Reservasi | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchWithToken(`/api/reservasi/${id}`)
      .then(setData)
      .catch((err) => console.error("Gagal ambil detail reservasi:", err));
  }, [id]);

  if (!data) return <div className="text-center py-10">Memuat data reservasi...</div>;

  return (
    <>
      <Breadcrumb pageName="Reservasi" mapName="Detail Reservasi" />
      <div className="space-y-9">
        <ShowcaseSection title="Detail Reservasi" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup type="" placeholder="" label="ID Reservasi" value={String(data.reservasi_id)} readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup type="" placeholder="" label="Dibuat" value={formatTanggal(data.created_at)} readOnly />
              <InputGroup type="" placeholder="" label="Diperbarui" value={formatTanggal(data.updated_at)} readOnly />
            </div>
            <InputGroup type="" placeholder="" label="Nama Pemesan" value={data.nama_pemesan} readOnly />
            <InputGroup type="" placeholder="" label="Kontak" value={data.kontak_pemesan} readOnly />
            <InputGroup type="" placeholder="" label="Tempat" value={data.tempat_reservasi?.lokasi || "Tidak diketahui"} readOnly />
            <InputGroup type="" placeholder="" label="Nama Acara" value={data.nama_acara} readOnly />
            <InputGroup type="" placeholder="" label="Tanggal Acara" value={formatTanggal(data.tanggal_acara)} readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup type="" placeholder="" label="Waktu Mulai" value={data.waktu_mulai || "-"} readOnly />
              <InputGroup type="" placeholder="" label="Waktu Selesai" value={data.waktu_selesai || "-"} readOnly />
            </div>
            <InputGroup type="" placeholder="" label="Jumlah Tamu" value={data.jumlah_tamu?.toString() || "-"} readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup type="" placeholder="" label="Status" value={data.status_reservasi} readOnly />
              <InputGroup type="" placeholder="" label="Mengetahui" value={data.mengetahui || "-"} readOnly />
            </div>
          </div>
          <TextAreaGroup placeholder="" label="Keterangan" value={data.keterangan || "-"} disabled />
        </ShowcaseSection>
      </div>
    </>
  );
}
