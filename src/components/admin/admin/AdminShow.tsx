// app/admin/admin/show/[id]/page.tsx
"use client";

import { fetchWithToken } from "@/services/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

// Tipe data untuk admin
interface Admin {
  name: string;
  email: string;
  password: string;
  role?:{
  role_name: string;
  };
}

export default function ShowAdminPage() {
  const { id } = useParams();
  const [data, setData] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchWithToken(`/api/user/${id}`);
        setData(json);
      } catch (err) {
        console.error("Gagal mengambil detail admin:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <div className="text-center py-10">Memuat data</div>;

  return (
    <>
      <Breadcrumb pageName="Admin" mapName="Detail Admin" />
      <div className="space-y-9">
        <ShowcaseSection title="Informasi Admin" className="!p-6.5 space-y-5.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="Nama"
              name="name"
              type="text"
              placeholder=""
              value={data.name}
              readOnly
            />
            <InputGroup
              label="Email"
              name="email"
              type="email"
              placeholder=""
              value={data.email}
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="Role"
              name="role"
              type="text"
              placeholder=""
              value={data.role?.role_name || "-"}
              readOnly
            />
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}
