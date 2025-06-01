// app/admin/admin/create/page.tsx
"use client";

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`);
        const data = await res.json();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal menyimpan user");
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
      <Breadcrumb pageName="Create Admin" />
      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Form Admin" className="space-y-5.5 !p-6.5">
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
            </ShowcaseSection>
          </div>
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


// app/admin/admin/create/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import InputGroup from "@/components/FormElements/InputGroup";
// import { Select } from "@/components/FormElements/select";
// import { ShowcaseSection } from "@/components/Layouts/showcase-section";

// type Role = {
//   role_id: number;
//   role_name: string;
// };

// export default function CreateAdminPage() {
//   const router = useRouter();
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role_id: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`);
//         const data = await res.json();
//         console.log("API Response:", data);
//         console.log("Fetched roles data:", data.data);
//         setRoles(data ?? []);
//         console.log("Set roles to state:", data.data);
//       } catch (err) {
//         console.error("Gagal ambil role:", err);
//       }
//     };

//     fetchRoles();
//     console.log("fect role" , fetchRoles)
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handler khusus untuk Select component (karena tidak punya name attribute)
//   const handleRoleChange = (roleId: string) => {
//     setForm({ ...form, role_id: roleId });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validasi form frontend
//     if (!form.name || !form.email || !form.password || !form.role_id) {
//       setError("Semua field wajib diisi.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         throw new Error(json.message || "Gagal menyimpan user");
//       }

//       router.push("/admin/admin");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Terjadi kesalahan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Transform roles data untuk Select component
//   const roleItems = roles.map(role => ({
//     value: role.role_id.toString(),
//     label: role.role_name
//   }));

//   console.log("Mapped roleItems:", roleItems);

//   console.log("roleItems array:", roleItems);
//   roleItems.forEach(item => console.log(`value: ${item.value}, label: ${item.label}`));


//   return (
//     <>
//       <Breadcrumb pageName="Create Admin" />
//       <form onSubmit={handleSubmit} className="space-y-9">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
//           <div className="flex flex-col gap-9">
//             <ShowcaseSection title="Form Admin" className="space-y-5.5 !p-6.5">
//               <InputGroup
//                 label="Nama"
//                 name="name"
//                 placeholder="Nama pengguna"
//                 type="text"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//               <InputGroup
//                 label="Email"
//                 name="email"
//                 placeholder="Email pengguna"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//               />
//               <InputGroup
//                 label="Password"
//                 name="password"
//                 placeholder="Password minimal 8 karakter"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//               />
//               <RoleSelect
//                 label="Pilih Role"
//                 items={roleItems}
//                 placeholder="Pilih role untuk admin"
//                 value={form.role_id}
//                 onChange={handleRoleChange}
//               />
//             </ShowcaseSection>
//           </div>
//         </div>

//         {error && <div className="text-red-500">{error}</div>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
//         >
//           {loading ? "Menyimpan..." : "Simpan"}
//         </button>
//       </form>
//     </>
//   );
// }

// // Component khusus untuk Role Select yang mendukung onChange
// function RoleSelect({
//   label,
//   items,
//   placeholder,
//   value,
//   onChange,
// }: {
//   label: string;
//   items: { value: string; label: string }[];
//   placeholder: string;
//   value: string;
//   onChange: (value: string) => void;
// }) {
//   const id = `role-select-${Math.random()}`;
//   const [isOptionSelected, setIsOptionSelected] = useState(!!value);

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = e.target.value;
//     setIsOptionSelected(!!selectedValue);
//     onChange(selectedValue);
//   };

//   return (
//     <div className="space-y-3">
//       <label
//         htmlFor={id}
//         className="block text-body-sm font-medium text-dark dark:text-white"
//       >
//         {label}
//       </label>

//       <div className="relative">
//         <select
//           id={id}
//           value={value}
//           onChange={handleSelectChange}
//           className={`w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6 ${
//             isOptionSelected ? "text-dark dark:text-white" : ""
//           }`}
//         >
//           <option value="" disabled hidden>
//             {placeholder}
//           </option>
//           {items.map((item) => (
//             <option key={item.value} value={item.value}>
//               {item.label}
//             </option>
//           ))}
//         </select>

//         {/* Chevron icon - Anda mungkin perlu menyesuaikan dengan icon yang ada */}
//         <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
//           <svg
//             className="h-4 w-4 rotate-180"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 15l7-7 7 7"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }