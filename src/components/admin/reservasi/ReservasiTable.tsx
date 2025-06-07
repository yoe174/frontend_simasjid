// src/components/admin/reservasi/ReservasiTable.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Calendar, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Select } from "@/components/FormElements/select";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader";
import { PreviewIcon } from "@/components/Tables/icons";

type Reservasi = {
  reservasi_id: number;
  nama_pemesan: string;
  kontak_pemesan: string;
  tempat_reservasi?: {
    lokasi: string;
  };
  nama_acara: string;
  tanggal_acara: string;
  status_reservasi: string;
  mengetahui?: string;
};

export default function ReservasiTable() {
  const [data, setData] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  // filter data
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  // Update summary untuk menggunakan filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter berdasarkan search term (nama pemesan, nama acara, lokasi)
      const matchesSearch = searchTerm === "" || 
        item.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_acara.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tempat_reservasi?.lokasi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      // Filter berdasarkan status
      const matchesStatus = statusFilter === "semua" || item.status_reservasi === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // Update summary untuk menggunakan filteredData
  const summary = useMemo(() => {
    const totalReservasi = data.length; // Total tetap menggunakan data asli
    const reservasiDijadwalkan = data.filter(item => item.status_reservasi === "dijadwalkan").length;
    const reservasiDilaksanakan = data.filter(item => item.status_reservasi === "dilaksanakan").length;
    const reservasiSelesai = data.filter(item => item.status_reservasi === "selesai").length;
    const reservasiBatal = data.filter(item => item.status_reservasi === "batal").length;

    return {
      total: totalReservasi,
      dijadwalkan: reservasiDijadwalkan,
      dilaksanakan: reservasiDilaksanakan,
      selesai: reservasiSelesai,
      batal: reservasiBatal,
      filtered: filteredData.length // Tambahan untuk menampilkan jumlah hasil filter
    };
  }, [data, filteredData]);

  const fetchData = async () => {
    try {
      const res = await fetchWithToken("/api/reservasi");
      setData(res);
    } catch (err) {
      console.error("Gagal mengambil data reservasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus reservasi ini?")) return;

    try {
      await fetchWithToken(`/api/reservasi/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((item) => item.reservasi_id !== id));
      alert("Reservasi berhasil dihapus");
    } catch (err) {
      alert("Gagal menghapus reservasi");
    }
  };

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "dilaksanakan", label: "Dilaksanakan" },
    { value: "selesai", label: "Selesai" },
    { value: "batal", label: "Batal" }
  ];

  if (loading) return <SkeletonLoader type="form" />;

  return (
    <>
      <Breadcrumb pageName="Reservasi" mapName="Page Reservasi" />
      {/* Summary Cards */}
      <div className="border-b border-stroke py-5.5 dark:border-dark-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card Total Reservasi */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reservasi</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Reservasi Dijadwalkan */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dijadwalkan</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.dijadwalkan}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Reservasi Dilaksanakan */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dilaksanakan</h3>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {summary.dilaksanakan}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Card Reservasi Selesai */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Selesai</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {summary.selesai}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Card Reservasi Batal */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Batal</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {summary.batal}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        {/* Header dengan Filter dan Search - DIUBAH */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Reservasi</h1>
            {(searchTerm || statusFilter !== "semua") && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({summary.filtered} dari {summary.total} data)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-dark text-dark dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <Select 
                label="" 
                placeholder="Filter Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                items={statusOptions}
                prefixIcon={<Filter className="h-4 w-4 text-gray-400" />}
                className="mb-0"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "semua") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("semua");
                }}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-red-300 dark:hover:border-red-600 transition-colors"
              >
                Reset
              </button>
            )}

            <Link
              href={withAdminPrefix(`/reservasi/create`)}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Tambah Reservasi
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead>ID</TableHead>
              <TableHead>Nama Pemesan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Tempat</TableHead>
              <TableHead>Acara</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* TableBody yang diupdate untuk menggunakan filteredData */}
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "semua" 
                    ? "Tidak ada data yang sesuai dengan filter" 
                    : "Tidak ada data reservasi"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.reservasi_id} className="text-base font-medium text-dark dark:text-white">
                  <TableCell>{item.reservasi_id}</TableCell>
                  <TableCell>
                    {/* Highlight search term */}
                    {searchTerm && item.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: item.nama_pemesan.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      item.nama_pemesan
                    )}
                  </TableCell>
                  <TableCell>{item.kontak_pemesan}</TableCell>
                  <TableCell>
                    {/* Highlight search term untuk lokasi */}
                    {searchTerm && item.tempat_reservasi?.lokasi?.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: (item.tempat_reservasi?.lokasi || "Tidak diketahui").replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      item.tempat_reservasi?.lokasi || "Tidak diketahui"
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Highlight search term untuk nama acara */}
                    {searchTerm && item.nama_acara.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: item.nama_acara.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      item.nama_acara
                    )}
                  </TableCell>
                  <TableCell>{item.tanggal_acara}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3 border ${
                        item.status_reservasi === "dijadwalkan"
                          ? "text-blue border-blue"
                          : item.status_reservasi === "dilaksanakan"
                          ? "text-yellow-600 border-yellow-600"
                          : item.status_reservasi === "selesai"
                          ? "text-green border-green"
                          : item.status_reservasi === "batal"
                          ? "text-red border-red"
                          : ""
                      }`}
                    >
                      {item.status_reservasi}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-x-3.5">
                      <Link
                        href={withAdminPrefix(`/reservasi/show/${item.reservasi_id}`)}
                        className="hover:text-primary"
                      >
                        <PreviewIcon />
                      </Link>
                      <Link
                        href={withAdminPrefix(`/reservasi/edit/${item.reservasi_id}`)}
                        className="hover:text-green"
                      >
                        <PencilSquareIcon />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.reservasi_id)}
                        className="hover:text-red"
                        aria-label="Hapus Reservasi"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
