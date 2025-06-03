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
};

type Reservasi = {
  reservasi_id: number;
  nama_pemesan: string;
  kontak_pemesan: string;
  tempat_reservasi_id: number;
  nama_acara: string;
  tanggal_acara: string;
  waktu_mulai: string | null;
  waktu_selesai: string | null;
  jumlah_tamu: number | null;
  status_reservasi: 'menunggu' | 'dikonfirmasi' | 'dijadwalkan' | 'dilaksanakan' | 'selesai' | 'batal';
  mengetahui: string | null;
  keterangan: string | null;
  tempatReservasi?: TempatReservasi;
  created_at?: string;
  updated_at?: string;
};

export default function ReservasiTable() {
  const [reservasi, setReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil data reservasi
  const fetchReservasi = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi`);
      if (!res.ok) throw new Error("Gagal mengambil data reservasi");
      const data = await res.json();
      setReservasi(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  // Fungsi hapus reservasi
  const handleDelete = async (reservasi_id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus reservasi ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${reservasi_id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus reservasi");
      const json = await res.json();
      alert(json.message || "Reservasi berhasil dihapus");

      // Hapus reservasi dari state
      setReservasi((prev) => prev.filter((item) => item.reservasi_id !== reservasi_id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  // Fungsi update status cepat
  const handleQuickStatusUpdate = async (reservasi_id: number, newStatus: string) => {
    const statusLabels = {
      dikonfirmasi: 'dikonfirmasi',
      dijadwalkan: 'dijadwalkan', 
      dilaksanakan: 'dilaksanakan',
      selesai: 'diselesaikan',
      batal: 'dibatalkan'
    };

    const label = statusLabels[newStatus as keyof typeof statusLabels] || newStatus;
    
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${label}?`)) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservasi/${reservasi_id}/status`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_reservasi: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status");
      
      alert(`Status berhasil diubah menjadi ${label}!`);
      
      // Refresh data
      fetchReservasi();
    } catch (err) {
      alert("Terjadi kesalahan saat mengupdate status");
      console.error(err);
    }
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format waktu
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5); // HH:MM
  };

  // Get status badge class dan label
  const getStatusBadgeInfo = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'menunggu':
        return { class: `${baseClass} bg-yellow-100 text-yellow-800`, label: 'Menunggu' };
      case 'dikonfirmasi':
        return { class: `${baseClass} bg-blue-100 text-blue-800`, label: 'Dikonfirmasi' };
      case 'dijadwalkan':
        return { class: `${baseClass} bg-purple-100 text-purple-800`, label: 'Dijadwalkan' };
      case 'dilaksanakan':
        return { class: `${baseClass} bg-orange-100 text-orange-800`, label: 'Dilaksanakan' };
      case 'selesai':
        return { class: `${baseClass} bg-green-100 text-green-800`, label: 'Selesai' };
      case 'batal':
        return { class: `${baseClass} bg-red-100 text-red-800`, label: 'Dibatalkan' };
      default:
        return { class: `${baseClass} bg-gray-100 text-gray-800`, label: status };
    }
  };

  // Get available status transitions untuk quick actions
  const getAvailableStatusTransitions = (currentStatus: string) => {
    const transitions: Record<string, { status: string; label: string; color: string }[]> = {
      menunggu: [
        { status: 'dikonfirmasi', label: 'Konfirmasi', color: 'bg-blue-500 hover:bg-blue-600' },
      ],
      dikonfirmasi: [
        { status: 'dijadwalkan', label: 'Jadwalkan', color: 'bg-purple-500 hover:bg-purple-600' },
      ],
      dijadwalkan: [
        { status: 'dilaksanakan', label: 'Laksanakan', color: 'bg-orange-500 hover:bg-orange-600' },
      ],
      dilaksanakan: [
        { status: 'selesai', label: 'Selesaikan', color: 'bg-green-500 hover:bg-green-600' }
      ],
      selesai: [],
      batal: []
    };

    return transitions[currentStatus] || [];
  };

  if (loading) return <div>Memuat data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Reservasi</h1>
        <Link
          href={withAdminPrefix(`/reservasi/create`)}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Tambah Reservasi
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-[50px] pl-5 sm:pl-6 xl:pl-7.5">#</TableHead>
              <TableHead className="min-w-[180px]">Pemesan</TableHead>
              <TableHead className="min-w-[140px]">Tempat</TableHead>
              <TableHead className="min-w-[100px]">Tanggal</TableHead>
              <TableHead className="min-w-[120px]">Waktu</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5 min-w-[150px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reservasi.map((item, i) => {
              const statusInfo = getStatusBadgeInfo(item.status_reservasi);
              const availableTransitions = getAvailableStatusTransitions(item.status_reservasi);
              
              return (
                <TableRow
                  className="text-base font-medium text-dark dark:text-white"
                  key={item.reservasi_id}
                >
                  <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{i + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{item.nama_pemesan}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.nama_acara}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {item.tempatReservasi?.lokasi || 'Tempat tidak ditemukan'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(item.tanggal_acara)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {item.waktu_mulai && item.waktu_selesai 
                        ? `${formatTime(item.waktu_mulai)} - ${formatTime(item.waktu_selesai)}`
                        : formatTime(item.waktu_mulai) || '-'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={statusInfo.class}>
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                    <div className="flex items-center justify-end gap-x-2">
                      {/* Quick Status Update Button */}
                      {availableTransitions.length > 0 && (
                        <button
                          onClick={() => handleQuickStatusUpdate(item.reservasi_id, availableTransitions[0].status)}
                          className={`px-2 py-1 rounded text-xs text-white font-medium ${availableTransitions[0].color} transition-colors`}
                          title={`${availableTransitions[0].label} reservasi`}
                        >
                          {availableTransitions[0].label}
                        </button>
                      )}
                      
                      {/* Standard Action Buttons */}
                      <Link
                        href={withAdminPrefix(`/reservasi/show/${item.reservasi_id}`)}
                        className="hover:text-primary"
                        aria-label="Lihat Detail Reservasi"
                        title="Lihat Detail"
                      >
                        <PreviewIcon />
                      </Link>
                      <Link
                        href={withAdminPrefix(`/reservasi/edit/${item.reservasi_id}`)}
                        className="hover:text-primary"
                        aria-label="Edit Reservasi"
                        title="Edit"
                      >
                        <PencilSquareIcon />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.reservasi_id)}
                        className="hover:text-primary"
                        aria-label="Hapus Reservasi"
                        title="Hapus"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {reservasi.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Belum ada data reservasi
        </div>
      )}
    </div>
  );
}