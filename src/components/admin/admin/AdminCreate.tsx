// app/admin/admin/create/page.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

type Role = {
  role_id: number;
  role_name: string;
};

export default function CreateAdminPage() {
  const router = useRouter();
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
    const fetchRoles = async () => {
      try {
        const data = await fetchWithToken(`/api/role`);
        // const data = await res.json();
        setRoles(data ?? []); // fallback empty array kalau undefined
      } catch (err) {
        console.error("Gagal ambil role:", err);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi form frontend
    if (!form.name || !form.email || !form.password || !form.role_id) {
      setError("Semua field wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchWithToken(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      router.push("/admin/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Admin" mapName="Create Admin"/>
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Form Admin" className="space-y-5.5 !p-6.5">
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
              <InputGroup
                label="Password"
                name="password"
                placeholder="Password minimal 8 karakter"
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
