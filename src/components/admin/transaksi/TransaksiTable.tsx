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

type Transaksi = {
  transaksi_id: number;
  kategori: "pemasukan" | "pengeluaran";
  jenis_transaksi_id: number;
  jenis_transaksi?: {
    jenis_name: string;
  };
  nominal: number;
  sumber?: string;
  mengetahui: string;
  status: "draft" | "valid";
  keterangan?: string;
  created_at: string;
};

export default function TransaksiTable() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransaksi = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transaksi`);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const json = await res.json();
      setTransaksiList(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transaksi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus transaksi");
      const json = await res.json();
      alert(json.message || "Transaksi berhasil dihapus");

      setTransaksiList((prev) => prev.filter((t) => t.transaksi_id !== id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  if (loading) return <SkeletonLoader type="form" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <><Breadcrumb pageName="Transaksi" mapName="Page Keuangan"/>
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Transaksi</h1>
        <Link
          href={withAdminPrefix(`/transaksi/create`)}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Tambah Transaksi
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[40px] pl-5 sm:pl-6 xl:pl-7.5">#</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Sumber</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transaksiList.map((item, i) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={item.transaksi_id}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{i + 1}</TableCell>
              {/* <TableCell className="capitalize">{item.kategori}</TableCell> */}
              <TableCell>
                  <span
                    className={`inline-block rounded-full px-3  ${
                      item.kategori === "pemasukan" ? "border-green hover:bg-green/10 text-green" : "border-red hover:bg-red/10 text-red"
                    }`}
                  >
                    {item.kategori}
                  </span>
                </TableCell>
              <TableCell>{item.jenis_transaksi?.jenis_name || "Tidak diketahui"}</TableCell>
              <TableCell>Rp {item.nominal.toLocaleString("id-ID")}</TableCell>
              <TableCell>{item.sumber || "Hamba Allah"}</TableCell>
              {/* <TableCell className="capitalize">{item.status}</TableCell> */}
              <TableCell>
                  <span
                    className={`inline-block rounded-full px-3  ${
                      item.status === "valid" ? "border border-blue hover:bg-blue/10 text-blue" : ""
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <Link
                    href={withAdminPrefix(`/transaksi/show/${item.transaksi_id}`)}
                    className="hover:text-primary"
                    aria-label="Lihat Transaksi"
                  >
                    <PreviewIcon />
                  </Link>
                  <Link
                    href={withAdminPrefix(`/transaksi/edit/${item.transaksi_id}`)}
                    className="hover:text-green"
                    aria-label="Edit Transaksi"
                  >
                    <PencilSquareIcon />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.transaksi_id)}
                    className="hover:text-red"
                    aria-label="Hapus Transaksi"
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
