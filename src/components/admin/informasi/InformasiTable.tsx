  // src\components\admin\informasi\InformasiTable.tsx
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

    const fetchInformasi = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi`);
        if (!res.ok) throw new Error("Gagal mengambil data informasi");
        const json = await res.json();
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/informasi/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Gagal menghapus informasi");
        const json = await res.json();
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


    if (loading) return <SkeletonLoader type="form" />;
    if (error) return <div>Error: {error}</div>;

    return (
      <>
      <Breadcrumb pageName="Informasi" mapName="Page Informasi"/>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Informasi</h1>
          <Link
            href={withAdminPrefix(`/informasi/create`)}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Tambah Informasi
          </Link>
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

          <TableBody>
            {informasiList.map((info, i) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={info.informasi_id}
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{info.informasi_id}</TableCell>
                <TableCell>{info.judul}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
      </>
    );
  }
