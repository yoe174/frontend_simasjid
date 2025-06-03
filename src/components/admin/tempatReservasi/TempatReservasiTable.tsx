// src\components\admin\tempatreservasi\TempatReservasiTable.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
import { PreviewIcon } from "@/components/Tables/icons";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";

type TempatReservasi = {
  tempat_reservasi_id: number;
  lokasi: string;
  kapasitas: number | null;
  keterangan: string | null;
  biaya: number | null;
  image: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function TempatReservasiTable() {
  const [tempatReservasi, setTempatReservasi] = useState<TempatReservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil data tempat reservasi
  const fetchTempatReservasi = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi`);
      if (!res.ok) throw new Error("Gagal mengambil data tempat reservasi");
      const data = await res.json();
      setTempatReservasi(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTempatReservasi();
  }, []);

  // Fungsi hapus tempat reservasi
  const handleDelete = async (tempat_reservasi_id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus tempat reservasi ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tempatReservasi/${tempat_reservasi_id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus tempat reservasi");
      const json = await res.json();
      alert(json.message || "Tempat reservasi berhasil dihapus");

      // Hapus tempat reservasi dari state
      setTempatReservasi((prev) => prev.filter((tempat) => tempat.tempat_reservasi_id !== tempat_reservasi_id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  // Format currency untuk biaya
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format kapasitas
  const formatKapasitas = (kapasitas: number | null) => {
    if (!kapasitas) return "Tidak terbatas";
    return `${kapasitas} orang`;
  };

  if (loading) return <div>Memuat data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Tempat Reservasi</h1>
        <Link
          href={withAdminPrefix(`/tempat_reservasi/create`)}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Tambah Tempat Reservasi
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[40px] pl-5 sm:pl-6 xl:pl-7.5">#</TableHead>
            <TableHead className="min-w-[200px]">Lokasi</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Biaya</TableHead>
            <TableHead className="min-w-[150px]">Keterangan</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tempatReservasi.map((tempat, i) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={tempat.tempat_reservasi_id}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{i + 1}</TableCell>
              <TableCell className="font-semibold">{tempat.lokasi}</TableCell>
              <TableCell>{formatKapasitas(tempat.kapasitas)}</TableCell>
              <TableCell className="text-green-600 font-semibold">
                {formatCurrency(tempat.biaya)}
              </TableCell>
              <TableCell>
                <div className="max-w-[150px] truncate" title={tempat.keterangan || ""}>
                  {tempat.keterangan || "Tidak ada keterangan"}
                </div>
              </TableCell>
              <TableCell>
                {tempat.image ? (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${tempat.image}`}
                      alt={tempat.lokasi}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder-image.png";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <Link
                    href={withAdminPrefix(`/tempat_reservasi/show/${tempat.tempat_reservasi_id}`)}
                    className="hover:text-primary"
                    aria-label="Lihat Tempat Reservasi"
                  >
                    <PreviewIcon />
                  </Link>
                  <Link
                    href={withAdminPrefix(`/tempat_reservasi/edit/${tempat.tempat_reservasi_id}`)}
                    className="hover:text-primary"
                    aria-label="Edit Tempat Reservasi"
                  >
                    <PencilSquareIcon />
                  </Link>
                  <button
                    onClick={() => handleDelete(tempat.tempat_reservasi_id)}
                    className="hover:text-primary"
                    aria-label="Hapus Tempat Reservasi"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tempatReservasi.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Belum ada data tempat reservasi
        </div>
      )}
    </div>
  );
}