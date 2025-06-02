// app/admin/admin/show/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

type Role = {
  role_id: number;
  role_name: string;
};

export default function ShowAdminPage() {
  const { id } = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: "",
    role_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roleRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`),
        ]);

        const userData = await userRes.json();
        const rolesData = await roleRes.json();

        setForm({
          name: userData.name,
          email: userData.email,
          role_id: String(userData.role_id),
          role_name: userData.role_name,
        });

        setRoles(rolesData ?? []);
      } catch (err) {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Breadcrumb pageName="Detail Admin" />
      <div className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Informasi Admin" className="space-y-5.5 !p-6.5">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500" >{error}</p>
              ) : (
                <>
                  <InputGroup
                    label="Nama"
                    name="name"
                    placeholder=""
                    type="text"
                    value={form.name}
                    readOnly 
                  />
                  <InputGroup
                    label="Email"
                    name="email"
                    placeholder=""
                    type="email"
                    value={form.email}
                    readOnly
                  />
                  <InputGroup
                    label="Role"
                    name="role"
                    placeholder=""
                    type="text"
                    value={
                      roles.find((role) => String(role.role_id) === form.role_id)?.role_name || "-"
                    }
                    readOnly
                  />
                </>
              )}
            </ShowcaseSection>
          </div>
        </div>
      </div>
    </>
  );
}
