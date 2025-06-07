// src\components\admin\admin\AdminEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithToken } from "@/services/auth";
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

  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // dikosongi, hanya diisi kalau ingin ganti password
    role_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch role untuk dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await fetchWithToken(`/api/role`);
        setRoles(data ?? []);
      } catch (err) {
        console.error("Gagal ambil role:", err);
      }
    };

    fetchRoles();
  }, []);

  // Fetch data user berdasarkan ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchWithToken(`/api/user/${params.id}`);
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "", // kosongkan, optional untuk update
          role_id: data.role_id?.toString() || "",
        });
      } catch (err) {
        console.error("Gagal ambil data admin:", err);
        setError("Gagal memuat data admin.");
      }
    };

    if (params.id) fetchUser();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.email || !form.role_id) {
      setError("Nama, Email, dan Role wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const body: any = {
        name: form.name,
        email: form.email,
        role_id: parseInt(form.role_id),
      };

      if (form.password) body.password = form.password;

      await fetchWithToken(`/api/user/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      router.push("/admin/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Admin" mapName="Edit Admin" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Admin" className="!p-6.5 space-y-5.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <InputGroup
                label="Password (opsional)"
                name="password"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </ShowcaseSection>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}
