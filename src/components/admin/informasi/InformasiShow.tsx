// src\components\admin\informasi\InformasiShow.tsx
"use client";

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

export default function ShowInformasiPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    informasi_id: "",
    judul: "",
    isi: "",
    status: "",
    keterangan: "",
    created_at: "",
    updated_at: "",
  });
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);


  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi/${id}`);
        const data = await res.json();

        setForm({
          informasi_id: data.informasi_id,
          judul: data.judul,
          isi: data.isi,
          status: data.status.toLowerCase(),
          keterangan: data.keterangan ?? "",
          created_at: data.created_at,
          updated_at: data.updated_at,
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

  return (
    <>
      <Breadcrumb pageName="Informasi" mapName="Detail Informasi" />

      <div className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Detail Informasi" className="!p-6.5 space-y-5.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup className="full"
                label="ID"
                name="informasi_id"
                placeholder=""
                type="text"
                value={form.informasi_id}
                readOnly
              />
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
                label="Terakhir Update"
                name="updated_at"
                placeholder=""
                type="text"
                value={formatTanggal(form.updated_at)}
                readOnly
              />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Judul"
                name="judul"
                placeholder=""
                type="text"
                value={form.judul}
                readOnly
              />
              <InputGroup
                label="Status"
                name="Status"
                placeholder=""
                type="text"
                value={form.status}
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextAreaGroup
                label="Isi"
                name="isi"
                placeholder=""
                value={form.isi}
                disabled
              />
              <TextAreaGroup
                label="Keterangan"
                name="keterangan"
                placeholder=""
                value={form.keterangan}
                disabled
              />
            </div>
            {gambarPreview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    </div>

                    {/* Modal Preview */}
                    {showFullImage && (
                    <div
                        onClick={() => setShowFullImage(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center shadow"
                    >
                        <img
                        src={gambarPreview}
                        alt="Full Preview"
                        className="max-w-3xl max-h-[80vh]"
                        />
                    </div>
                    )}
                </div>
            )}
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
