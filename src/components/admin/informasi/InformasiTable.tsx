// src\components\admin\informasi\InformasiTable.tsx
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
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
import { PreviewIcon } from "@/components/Tables/icons";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader"
import { Archive, BarChart3, Eye, FileText, Search, Filter } from "lucide-react";
import { Select } from "@/components/FormElements/select";

type Informasi = {
  informasi_id: number;
  judul: string;
  isi: string;
  created_at: string;
  status: "aktif" | "arsip";
  image?: string;
  keterangan?: string;
};

export default function InformasiTable() {
  const [informasiList, setInformasiList] = useState<Informasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter data states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [imageFilter, setImageFilter] = useState("semua");

  // Filtered data
  const filteredData = useMemo(() => {
    return informasiList.filter(item => {
      // Filter berdasarkan search term (judul, isi, keterangan)
      const matchesSearch = searchTerm === "" || 
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.isi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      // Filter berdasarkan status
      const matchesStatus = statusFilter === "semua" || item.status === statusFilter;

      // Filter berdasarkan gambar
      const matchesImage = imageFilter === "semua" || 
        (imageFilter === "ada" && item.image) ||
        (imageFilter === "tidak_ada" && !item.image);

      return matchesSearch && matchesStatus && matchesImage;
    });
  }, [informasiList, searchTerm, statusFilter, imageFilter]);

  // Update summary untuk menggunakan filtered data
  const summary = useMemo(() => {
    const totalInformasi = informasiList.length; // Total tetap menggunakan data asli
    const informasiAktif = informasiList.filter(info => info.status === "aktif").length;
    const informasiArsip = informasiList.filter(info => info.status === "arsip").length;
    const informasiDenganGambar = informasiList.filter(info => info.image).length;

    return {
      total: totalInformasi,
      aktif: informasiAktif,
      arsip: informasiArsip,
      denganGambar: informasiDenganGambar,
      filtered: filteredData.length // Tambahan untuk menampilkan jumlah hasil filter
    };
  }, [informasiList, filteredData]);

  const fetchInformasi = async () => {
    try {
      const json = await fetchWithToken("/api/informasi");
      setInformasiList(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInformasi();
  }, []);

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus informasi ini?");
    if (!konfirmasi) return;

    try {
      const json = await fetchWithToken(`/api/informasi/${id}`, {
        method: "DELETE",
      });
      
      alert(json.message || "Informasi berhasil dihapus");

      setInformasiList((prev) => prev.filter((info) => info.informasi_id !== id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  // fungsi format tanggal
  const formatTanggal = (tanggalString: string) => {
    const tanggal = new Date(tanggalString);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter options
  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "aktif", label: "Aktif" },
    { value: "arsip", label: "Arsip" }
  ];

  const imageOptions = [
    { value: "semua", label: "Semua Gambar" },
    { value: "ada", label: "Ada Gambar" },
    { value: "tidak_ada", label: "Tanpa Gambar" }
  ];

  if (loading) return <SkeletonLoader type="form" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName="Informasi" mapName="Page Informasi"/>
      {/* Summary Cards */}
      <div className="border-b border-stroke py-5.5 dark:border-dark-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card Total Informasi */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Informasi</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Informasi Aktif */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Informasi Aktif</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {summary.aktif}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Card Informasi Arsip */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Informasi Arsip</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {summary.arsip}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Archive className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Card Dengan Gambar */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dengan Gambar</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.denganGambar}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        {/* Header dengan Filter dan Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Informasi</h1>
            {(searchTerm || statusFilter !== "semua" || imageFilter !== "semua") && (
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

            {/* Image Filter */}
            {/* <div className="w-44">
              <Select 
                label="" 
                placeholder="Filter Gambar"
                value={imageFilter}
                onChange={(e) => setImageFilter(e.target.value)}
                items={imageOptions}
                prefixIcon={<Filter className="h-4 w-4 text-gray-400" />}
                className="mb-0"
              />
            </div> */}

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "semua" || imageFilter !== "semua") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("semua");
                  setImageFilter("semua");
                }}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-red-300 dark:hover:border-red-600 transition-colors"
              >
                Reset
              </button>
            )}

            <Link
              href={withAdminPrefix(`/informasi/create`)}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Tambah Informasi
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-[40px] pl-5 sm:pl-6 xl:pl-7.5">ID</TableHead>
              <TableHead className="min-w-[200px]">Judul</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* TableBody yang diupdate untuk menggunakan filteredData */}
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "semua" || imageFilter !== "semua"
                    ? "Tidak ada data yang sesuai dengan filter" 
                    : "Tidak ada data informasi"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((info, i) => (
                <TableRow
                  className="text-base font-medium text-dark dark:text-white"
                  key={info.informasi_id}
                >
                  <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{info.informasi_id}</TableCell>
                  <TableCell>
                    {/* Highlight search term untuk judul */}
                    {searchTerm && info.judul.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{
                        __html: info.judul.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                        )
                      }} />
                    ) : (
                      info.judul
                    )}
                  </TableCell>
                  <TableCell>{formatTanggal(info.created_at)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3  ${
                        info.status === "aktif" ? "border border-green hover:bg-green/10 text-green" : "border"
                      }`}
                    >
                      {info.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {info.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${info.image}`}
                        alt="Gambar"
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      "Tidak ada"
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                    <div className="flex items-center justify-end gap-x-3.5">
                      <Link
                        href={withAdminPrefix(`/informasi/show/${info.informasi_id}`)}
                        className="hover:text-primary"
                        aria-label="Lihat Informasi"
                      >
                        <PreviewIcon />
                      </Link>
                      <Link
                        href={withAdminPrefix(`/informasi/edit/${info.informasi_id}`)}
                        className="hover:text-green"
                        aria-label="Edit Informasi"
                      >
                        <PencilSquareIcon />
                      </Link>
                      <button
                        onClick={() => handleDelete(info.informasi_id)}
                        className="hover:text-red"
                        aria-label="Hapus Informasi"
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