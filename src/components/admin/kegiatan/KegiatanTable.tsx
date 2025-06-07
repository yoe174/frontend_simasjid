// src/components/admin/kegiatan/KegiatanTable.tsx
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

type Kegiatan = {
  kegiatan_id: number;
  nama_kegiatan: string;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  lokasi: string;
  status: string;
  keterangan?: string;
  isi: string;
};

export default function KegiatanTable() {
  const [data, setData] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  // filter data
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  // Update summary untuk menggunakan filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter berdasarkan search term (nama kegiatan, lokasi, isi)
      const matchesSearch = searchTerm === "" || 
        item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.isi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      // Filter berdasarkan status
      const matchesStatus = statusFilter === "semua" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // Update summary untuk menggunakan filteredData
  const summary = useMemo(() => {
    const totalKegiatan = data.length; // Total tetap menggunakan data asli
    const kegiatandijadwalkan = data.filter(item => item.status === "dijadwalkan").length;
    const kegiatandilaksanakan = data.filter(item => item.status === "dilaksanakan").length;
    const kegiatanselesai = data.filter(item => item.status === "selesai").length;
    const kegiatandibatalkan = data.filter(item => item.status === "dibatalkan").length;

    return {
      total: totalKegiatan,
      dijadwalkan: kegiatandijadwalkan,
      dilaksanakan: kegiatandilaksanakan,
      selesai: kegiatanselesai,
      dibatalkan: kegiatandibatalkan,
      filtered: filteredData.length // Tambahan untuk menampilkan jumlah hasil filter
    };
  }, [data, filteredData]);

  const fetchData = async () => {
    try {
      const res = await fetchWithToken("/api/kegiatan");
      setData(res);
    } catch (err) {
      console.error("Gagal mengambil data kegiatan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;

    try {
      await fetchWithToken(`/api/kegiatan/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((item) => item.kegiatan_id !== id));
      alert("Kegiatan berhasil dihapus");
    } catch (err) {
      alert("Gagal menghapus kegiatan");
    }
  };

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "dijadwalkan", label: "dijadwalkan" },
    { value: "dilaksanakan", label: "dilaksanakan" },
    { value: "selesai", label: "selesai" },
    { value: "dibatalkan", label: "dibatalkan" }
  ];

  // Fungsi format tanggal
  const formatTanggal = (tanggalString: string) => {
    const date = new Date(tanggalString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <SkeletonLoader type="form" />;

  return (
    <>
      <Breadcrumb pageName="Kegiatan" mapName="Page Kegiatan" />
      
      {/* Summary Cards */}
      <div className="border-b border-stroke py-5.5 dark:border-dark-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card Total Kegiatan */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Kegiatan</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Kegiatan Terjadwal */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Terjadwal</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.dijadwalkan}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Kegiatan Berlangsung */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Berlangsung</h3>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {summary.dilaksanakan}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Card Kegiatan Selesai */}
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

          {/* Card Kegiatan Batal */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Batal</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {summary.dibatalkan}
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
        {/* Header dengan Filter dan Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Kegiatan</h1>
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
                placeholder="Cari kegiatan, lokasi..."
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
              href={withAdminPrefix(`/kegiatan/create`)}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Tambah Kegiatan
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead>ID</TableHead>
              <TableHead>Nama Kegiatan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* TableBody yang menggunakan filteredData */}
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "semua" 
                    ? "Tidak ada data yang sesuai dengan filter" 
                    : "Tidak ada data kegiatan"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.kegiatan_id} className="text-base font-medium text-dark dark:text-white">
                  <TableCell>{item.kegiatan_id}</TableCell>
                  <TableCell>
                    {/* Highlight search term */}
                    {searchTerm && item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: item.nama_kegiatan.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      item.nama_kegiatan
                    )}
                  </TableCell>
                  <TableCell>{formatTanggal(item.tanggal)}</TableCell>
                  <TableCell>{item.waktu_mulai} - {item.waktu_selesai}</TableCell>
                  <TableCell>
                    {/* Highlight search term untuk lokasi */}
                    {searchTerm && item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: item.lokasi.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      item.lokasi
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3 border ${
                        item.status === "dijadwalkan"
                          ? "text-blue border-blue"
                          : item.status === "dilaksanakan"
                          ? "text-yellow-600 border-yellow-600"
                          : item.status === "selesai"
                          ? "text-green border-green"
                          : item.status === "dibatalkan"
                          ? "text-red border-red"
                          : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-x-3.5">
                      <Link
                        href={withAdminPrefix(`/kegiatan/show/${item.kegiatan_id}`)}
                        className="hover:text-primary"
                      >
                        <PreviewIcon />
                      </Link>
                      <Link
                        href={withAdminPrefix(`/kegiatan/edit/${item.kegiatan_id}`)}
                        className="hover:text-green"
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}