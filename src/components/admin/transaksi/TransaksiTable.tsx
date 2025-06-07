// src\components\admin\transaksi\TransaksiTable.tsx
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
import { Select } from "@/components/FormElements/select";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader"
import { CreditCard, DollarSign, FileText, SquareCheck, TrendingDown, TrendingUp, Wallet, Search, Filter } from "lucide-react";

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

type Summary = {
  pemasukan: number;
  pengeluaran: number;
  draft: number;
  saldo_tunai: number;
  saldo_rekening: number;
  total_saldo: number;
};

export default function TransaksiTable() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter dan search states
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  
  // state untuk summary
  const [summary, setSummary] = useState<Summary>({
    pemasukan: 0,
    pengeluaran: 0,
    draft: 0,
    saldo_tunai: 0,
    saldo_rekening: 0,
    total_saldo: 0
  });

  // Filtered data menggunakan useMemo
  const filteredData = useMemo(() => {
    return transaksiList.filter(item => {
      // Filter berdasarkan search term (jenis transaksi, sumber, keterangan)
      const matchesSearch = searchTerm === "" || 
        (item.jenis_transaksi?.jenis_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.sumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.nominal.toString().includes(searchTerm) ||
        false;

      // Filter berdasarkan kategori
      const matchesKategori = kategoriFilter === "semua" || item.kategori === kategoriFilter;

      // Filter berdasarkan status
      const matchesStatus = statusFilter === "semua" || item.status === statusFilter;

      return matchesSearch && matchesKategori && matchesStatus;
    });
  }, [transaksiList, searchTerm, kategoriFilter, statusFilter]);

  // Update summary untuk menampilkan info filtered data
  const filteredSummary = useMemo(() => {
    const filtered = filteredData.length;
    const total = transaksiList.length;
    
    return { filtered, total };
  }, [filteredData, transaksiList]);

  const fetchTransaksi = async () => {
    try {
      const json = await fetchWithToken("/api/transaksi");
      setTransaksiList(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const json = await fetchWithToken("/api/transaksi/summary");
      setSummary(json);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchTransaksi();
    fetchSummary();
  }, []);

  // fungsi format tanggal
    const formatTanggal = (tanggalString: string) => {
      const tanggal = new Date(tanggalString);
      return tanggal.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

  const handleValidate = async (id: number) => {
    const konfirmasi = confirm("Validasi transaksi ini?");
    if (!konfirmasi) return;

    try {
      console.log("Sending validation request for ID:", id);
      
      const result = await fetchWithToken(`/api/transaksi/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "valid" }),
      });

      console.log("API result:", result);

      // Update status di frontend (optimistic update)
      setTransaksiList((prev) =>
        prev.map((item) =>
          item.transaksi_id === id ? { ...item, status: "valid" } : item
        )
      );

      // Refresh data untuk memastikan sinkronisasi
      await Promise.all([
        fetchTransaksi(),
        fetchSummary()
      ]);

      alert("Transaksi berhasil divalidasi.");

    } catch (err) {
      console.error("Validation error:", err);
      
      try {
        await Promise.all([
          fetchTransaksi(),
          fetchSummary()
        ]);
        
        alert("Transaksi berhasil divalidasi.");
        
      } catch (refreshError) {
        console.error("Failed to refresh data:", refreshError);
        alert("Terjadi kesalahan saat validasi, silakan refresh halaman.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!konfirmasi) return;

    try {
      const json = await fetchWithToken(`/api/transaksi/${id}`, {
        method: "DELETE",
      });
      fetchSummary();
      alert(json.message || "Transaksi berhasil dihapus");

      setTransaksiList((prev) => prev.filter((t) => t.transaksi_id !== id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  // Options untuk filter
  const kategoriOptions = [
    { value: "semua", label: "Semua" },
    { value: "pemasukan", label: "Pemasukan" },
    { value: "pengeluaran", label: "Pengeluaran" }
  ];

  const statusOptions = [
    { value: "semua", label: "Semua" },
    { value: "draft", label: "Draft" },
    { value: "valid", label: "Valid" }
  ];

  // Fungsi untuk highlight search term
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return (
        <span dangerouslySetInnerHTML={{
          __html: text.replace(
            new RegExp(`(${searchTerm})`, 'gi'),
            '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
          )
        }} />
      );
    }
    return text;
  };

  if (loading) return <SkeletonLoader type="form" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName="Transaksi" mapName="Page Keuangan"/>
      
      <div className="border-b border-stroke py-5.5 dark:border-dark-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
          {/* Card Pemasukan */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pemasukan</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Rp {summary.pemasukan.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Card Pengeluaran */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pengeluaran</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Rp {summary.pengeluaran.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Card Draft */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaksi Draft</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {summary.draft} Transaksi
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card Saldo Tunai */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Tunai</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Rp {summary.saldo_tunai.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Card Saldo Rekening */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Rekening</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Rp {summary.saldo_rekening.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Card Total Saldo */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Saldo</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Rp {summary.total_saldo.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        {/* Header dengan Filter dan Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Transaksi</h1>
            {(searchTerm || kategoriFilter !== "semua" || statusFilter !== "semua") && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({filteredSummary.filtered} dari {filteredSummary.total} data)
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

            {/* Kategori Filter */}
            <div className="w-40">
              <Select 
                label="" 
                placeholder="Filter Kategori"
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                items={kategoriOptions}
                prefixIcon={<Filter className="h-4 w-4 text-gray-400" />}
                className="mb-0"
              />
            </div>

            {/* Status Filter */}
            <div className="w-36">
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
            {(searchTerm || kategoriFilter !== "semua" || statusFilter !== "semua") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setKategoriFilter("semua");
                  setStatusFilter("semua");
                }}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-red-300 dark:hover:border-red-600 transition-colors"
              >
                Reset
              </button>
            )}

            <Link
              href={withAdminPrefix(`/transaksi/create`)}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Tambah Transaksi
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead>ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Sumber</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validasi</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm || kategoriFilter !== "semua" || statusFilter !== "semua"
                    ? "Tidak ada data yang sesuai dengan filter" 
                    : "Tidak ada data transaksi"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, i) => (
                <TableRow
                  className="text-base font-medium text-dark dark:text-white"
                  key={item.transaksi_id}
                >
                  <TableCell className="capitalize">{item.transaksi_id}</TableCell>
                  <TableCell className="capitalize">{formatTanggal(item.created_at)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3  ${
                        item.kategori === "pemasukan" ? "border-green hover:bg-green/10 text-green" : "border-red hover:bg-red/10 text-red"
                      }`}
                    >
                      {item.kategori}
                    </span>
                  </TableCell>
                  <TableCell>
                    {highlightSearchTerm(item.jenis_transaksi?.jenis_name || "Tidak diketahui", searchTerm)}
                  </TableCell>
                  <TableCell>
                    {highlightSearchTerm(`Rp ${item.nominal.toLocaleString("id-ID")}`, searchTerm)}
                  </TableCell>
                  <TableCell>
                    {highlightSearchTerm(item.sumber || "Hamba Allah", searchTerm)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3  ${
                        item.status === "valid" ? "border border-blue hover:bg-blue/10 text-blue" : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.status === "draft" && (
                      <button
                        onClick={() => handleValidate(item.transaksi_id)}
                        className="text-green hover:text-green-dark"
                        title="Validasi Transaksi"
                      >
                        <SquareCheck/>
                      </button>
                    )}
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
                      {item.status === "draft" && (
                        <>
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
                        </>
                      )}
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