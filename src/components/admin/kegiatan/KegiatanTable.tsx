// src\components\admin\kegiatan\KegiatanTable.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
import { PreviewIcon } from "@/components/Tables/icons";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader"

type Kegiatan = {
  kegiatan_id: number;
  nama_kegiatan: string;
  isi: string;
  tanggal: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  lokasi: string;
  status: "dijadwalkan" | "dilaksanakan" | "selesai" | "dibatalkan";
  image?: string;
  keterangan?: string;
};

export default function KegiatanTable() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchKegiatan = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kegiatan`);
      if (!res.ok) throw new Error("Gagal mengambil data kegiatan");
      const json = await res.json();
      setKegiatanList(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus kegiatan ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kegiatan/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus kegiatan");
      const json = await res.json();
      alert(json.message || "Kegiatan berhasil dihapus");

      setKegiatanList((prev) => prev.filter((item) => item.kegiatan_id !== id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  const formatTanggal = (tanggalString: string) => {
    const tanggal = new Date(tanggalString);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <SkeletonLoader type="form" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName="Kegiatan" mapName="Page Kegiatan" />
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Kegiatan</h1>
          <Link
            href={withAdminPrefix(`/kegiatan/create`)}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Tambah Kegiatan
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="pl-5">ID</TableHead>
              <TableHead>Nama Kegiatan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Gambar</TableHead> */}
              <TableHead className="text-right pr-5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kegiatanList.map((item) => (
              <TableRow
                key={item.kegiatan_id}
                className="text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="pl-5">{item.kegiatan_id}</TableCell>
                <TableCell>{item.nama_kegiatan}</TableCell>
                <TableCell>{formatTanggal(item.tanggal)}</TableCell>
                <TableCell>{item.lokasi}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-full px-3 border ${
                      item.status === "dijadwalkan"
                        ? "text-blue border-blue"
                        : item.status === "dilaksanakan"
                        ? "text-yellow-600 border-yellow-600"
                        : item.status === "selesai"
                        ? "text-green border-green"
                        : "text-red border-red"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                {/* <TableCell>
                  {item.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image}`}
                      alt="Gambar"
                      className="w-20 h-12 object-cover rounded"
                    />
                  ) : (
                    "Tidak ada"
                  )}
                </TableCell> */}
                <TableCell className="text-right pr-5">
                  <div className="flex justify-end gap-x-3.5">
                    <Link
                      href={withAdminPrefix(`/kegiatan/show/${item.kegiatan_id}`)}
                      className="hover:text-primary"
                      aria-label="Lihat Kegiatan"
                    >
                      <PreviewIcon />
                    </Link>
                    <Link
                      href={withAdminPrefix(`/kegiatan/edit/${item.kegiatan_id}`)}
                      className="hover:text-green"
                      aria-label="Edit Kegiatan"
                    >
                      <PencilSquareIcon />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.kegiatan_id)}
                      className="hover:text-red"
                      aria-label="Hapus Kegiatan"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
