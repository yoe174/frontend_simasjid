// src\components\admin\admin\AdminEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

type Role = {
  role_id: number;
  role_name: string;
};

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ambil data role
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`);
        const data = await res.json();
        setRoles(data ?? []);
      } catch (err) {
        console.error("Gagal ambil role:", err);
      }
    };

    // Ambil data user by id
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`);
        const data = await res.json();
        setForm({
          name: data.name,
          email: data.email,
          password: data.password, // password tidak ditampilkan
          role_id: String(data.role_id),
        });
      } catch (err) {
        console.error("Gagal ambil user:", err);
      }
    };

    fetchRoles();
    if (id) fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.email || !form.password || !form.role_id) {
      setError("Semua field wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal mengupdate user");
      }

      router.push("/admin/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Edit Admin" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Edit Admin" className="space-y-5.5 !p-6.5">
              <InputGroup
                label="Nama"
                name="name"
                placeholder="Nama pengguna"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Email"
                name="email"
                placeholder="Email pengguna"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <InputGroup
                label="Password"
                name="password"
                placeholder="Password baru (min 8 karakter)"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Select
                label="Role"
                placeholder="Pilih Role"
                value={form.role_id}
                onChange={(e) =>
                  setForm({ ...form, role_id: e.target.value })
                }
                items={roles.map((role) => ({
                  value: String(role.role_id),
                  label: role.role_name,
                }))}
              />
            </ShowcaseSection>
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </>
  );
}
