// src\components\admin\admin\AdminTable.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
import { PreviewIcon } from "@/components/Tables/icons";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import SkeletonLoader from "@/components/FormElements/Skeleton/SkeletonLoader"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

type User = {
  user_id: number;
  role_id: number;
  name: string;
  email: string;
  password: string;
  role?: {
    role_name: string;
  };
};

export default function AdminTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil data user
  const fetchUsers = async () => {
    try {
      const json = await fetchWithToken(`/api/user`);
      setUsers(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi hapus user
  const handleDelete = async (user_id: number) => {
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus user ini?");
    if (!konfirmasi) return;

    try {
      const json = await fetchWithToken(`/api/user/${user_id}`, {
        method: "DELETE",
      });

      alert(json.message || "User berhasil dihapus");

      // Hapus user dari state
      setUsers((prev) => prev.filter((u) => u.user_id !== user_id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus");
      console.error(err);
    }
  };

  if (loading) return <SkeletonLoader type="form" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Breadcrumb pageName="Admin" mapName="Page Admin"/>
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Daftar Admin</h1>
        <Link
          href={withAdminPrefix(`/admin/create`)}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Tambah Admin
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[40px] pl-5 sm:pl-6 xl:pl-7.5">ID</TableHead>
            <TableHead className="min-w-[200px]">Username</TableHead>
            <TableHead>Email</TableHead>
            {/* <TableHead>Password</TableHead> */}
            <TableHead>Role</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, i) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={user.user_id}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{user.user_id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              {/* <TableCell>{user.password}</TableCell> */}
              <TableCell>{user.role?.role_name || "Tidak diketahui"}</TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <Link
                    href={withAdminPrefix(`/admin/show/${user.user_id}`)}
                    className="hover:text-primary"
                    aria-label="Lihat User"
                  >
                    <PreviewIcon />
                  </Link>
                  <Link
                    href={withAdminPrefix(`/admin/edit/${user.user_id}`)}
                    className="hover:text-green"
                    aria-label="Edit Admin"
                  >
                    <PencilSquareIcon />
                  </Link>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="hover:text-red"
                    aria-label="Hapus Admin"
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
