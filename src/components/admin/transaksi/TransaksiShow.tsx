// src\components\admin\transaksi\TransaksiShow.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader"

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

type Transaksi = {
  transaksi_id: number;
  kategori: "pemasukan" | "pengeluaran";
  jenis_transaksi?: {
    jenis_name: string;
  };
  nominal: number;
  sumber?: string;
  mengetahui: string;
  status: "draft" | "valid";
  keterangan?: string;
  created_at: string;
  updated_at: string;
};

export default function ShowTransaksiPage() {
  const { id } = useParams();
  const [data, setData] = useState<Transaksi | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchWithToken(`/api/transaksi/${id}`);
        setData(json);
      } catch (err) {
        console.error("Gagal mengambil detail transaksi:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <div className="text-center py-10">Memuat data</div>;

  return (
    <>
      <Breadcrumb pageName="Transaksi" mapName="Detail Transaksi" />
      <div className="space-y-9">
        <ShowcaseSection title="Detail Transaksi" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="ID Transaksi"
              name="transaksi_id"
              type="text"
              placeholder=""
              value={String(data.transaksi_id)}
              readOnly
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup
                label="Dibuat"
                name="created_at"
                type="text"
                placeholder=""
                value={formatTanggal(data.created_at)}
                readOnly
              />
              <InputGroup
                label="Diperbarui"
                name="updated_at"
                type="text"
                placeholder=""
                value={formatTanggal(data.updated_at)}
                readOnly
              />
            </div>            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Kategori"
                name="kategori"
                type="text"
                placeholder=""
                value={data.kategori}
                readOnly
              />
              <InputGroup
                label="Jenis Transaksi"
                name="jenis_transaksi"
                type="text"
                placeholder=""
                value={data.jenis_transaksi?.jenis_name || "Tidak diketahui"}
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Status"
                name="status"
                type="text"
                placeholder=""
                value={data.status}
                readOnly
              />
              <InputGroup
                label="Mengetahui"
                name="mengetahui"
                type="text"
                placeholder=""
                value={data.mengetahui}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="Nominal"
              name="nominal"
              type="text"
              placeholder=""
              value={`Rp ${data.nominal.toLocaleString("id-ID")}`}
              readOnly
            />
            <InputGroup
              label="Sumber"
              name="sumber"
              type="text"
              placeholder=""
              value={data.sumber || "Hamba Allah"}
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          </div>
          <TextAreaGroup
            label="Keterangan"
            name="keterangan"
            placeholder=""
            value={data.keterangan}
            disabled
          />
        </ShowcaseSection>
      </div>
    </>
  );
}
