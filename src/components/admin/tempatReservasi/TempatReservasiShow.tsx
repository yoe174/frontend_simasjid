"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

// Fungsi bantu untuk format tanggal
const formatTanggal = (tanggalString: string) => {
  const date = new Date(tanggalString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ShowTempatReservasiPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    tempat_reservasi_id: "",
    lokasi: "",
    kapasitas: "",
    biaya: "",
    keterangan: "",
    created_at: "",
    updated_at: "",
  });

  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithToken(`/api/tempatReservasi/${id}`);

        setForm({
          tempat_reservasi_id: data.tempat_reservasi_id,
          lokasi: data.lokasi,
          kapasitas: data.kapasitas ?? "",
          biaya: data.biaya ?? "0",
          keterangan: data.keterangan ?? "",
          created_at: data.created_at,
          updated_at: data.updated_at,
        });

        if (data.image) {
          setGambarPreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/${data.image}`);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  return (
    <>
      <Breadcrumb pageName="Tempat Reservasi" mapName="Detail Tempat" />
      <div className="space-y-9">
        <ShowcaseSection title="Detail Tempat Reservasi" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup type="text" placeholder="" label="ID" name="id" value={form.tempat_reservasi_id} readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Dibuat"
                name="created_at"
                placeholder=""
                type="text"
                value={formatTanggal(form.created_at)}
                readOnly
              />
              <InputGroup
                label="Diperbarui"
                name="updated_at"
                placeholder=""
                type="text"
                value={formatTanggal(form.updated_at)}
                readOnly
              />
            </div>
            <InputGroup type="text" placeholder="" label="Lokasi" name="lokasi" value={form.lokasi} readOnly />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup type="text" placeholder="" label="Kapasitas" name="kapasitas" value={form.kapasitas} readOnly />
              <InputGroup type="text" placeholder="" label="Biaya" name="biaya" value={`Rp ${parseFloat(form.biaya).toLocaleString("id-ID")}`} readOnly />
            </div>
          </div>
          <TextAreaGroup placeholder="" label="Keterangan" name="keterangan" value={form.keterangan} disabled />

          {gambarPreview && (
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Gambar
              </label>
              <img
                src={gambarPreview}
                alt="Preview"
                onClick={() => setShowFullImage(true)}
                className="w-40 h-auto rounded shadow cursor-pointer hover:scale-105 transition-transform"
              />
              {showFullImage && (
                <div
                  onClick={() => setShowFullImage(false)}
                  className="fixed inset-0 z-50 flex items-center justify-center"
                >
                  <img src={gambarPreview} alt="Full" className="max-w-3xl max-h-[80vh]" />
                </div>
              )}
            </div>
          )}
        </ShowcaseSection>
      </div>
    </>
  );
}
