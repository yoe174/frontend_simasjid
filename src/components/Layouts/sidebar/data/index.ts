import { BookUser, Calendar, Home, Info, Notebook, NotebookIcon, UserCircle, Wallet } from "lucide-react";
import * as Icons from "../icons";
import { addAdminPrefix } from "@/utils/prefixAdminUrl";
import { url } from "inspector";

export interface NavItem {
  title: string;
  url: string;
  icon: any;
  items: any[];
  requireSuperAdmin?: boolean; // Tambahkan property ini
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

const rawNavData: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        items: [],
      },
      {
        title: "Keuangan",
        url: "/transaksi",
        icon: Wallet,
        items: []
      },
      {
        title: "Informasi",
        url: "/informasi",
        icon: Info,
        items: [],
      },
      {
        title: "Kegiatan",
        url: "/kegiatan",
        icon: Calendar,
        items: [],
      },
      {
        title: "Reservasi",
        url: "/reservasi",
        icon: BookUser,
        items: [],
      },
      {
        title: "Tempat Reservasi",
        url: "/tempat_reservasi",
        icon: NotebookIcon,
        items: [],
      },
      {
        title: "Admin",
        url: "/admin",
        icon: UserCircle,
        items: [],
        requireSuperAdmin: true, // ⬅️ Tambahkan ini
      },
    ],
  },
];

// Fungsi untuk filter nav data berdasarkan role
export const getFilteredNavData = (isSuperAdmin: boolean) => {
  const filteredData = rawNavData.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Jika item memerlukan superadmin, hanya tampilkan jika user adalah superadmin
      if (item.requireSuperAdmin && !isSuperAdmin) {
        return false;
      }
      return true;
    })
  }));

  return addAdminPrefix(filteredData);
};

// Export original data untuk backward compatibility
export const NAV_DATA = addAdminPrefix(rawNavData);

// const rawNavData = [
//   {
//     label: "MAIN MENU",
//     items: [
//       {
//         title: "Dashboard",
//         url: "/dashboard",
//         icon: Home,
//         items: [],
//       },
//       {
//         title: "Keuangan",
//         url: "/transaksi",
//         icon: Wallet,
//         items: []
//       },
//       {
//         title: "Informasi",
//         url: "/informasi",
//         icon: Info,
//         items: [],
//       },
//       {
//         title: "kegiatan",
//         url: "/kegiatan",
//         icon: Calendar,
//         items: [],
//       },
//       {
//         title: "Reservasi",
//         url: "/reservasi",
//         icon: BookUser,
//         items: [],
//       },
//       {
//         title: "Tempat Reservasi",
//         url: "/tempat_reservasi",
//         icon: NotebookIcon,
//         items: [],
//       },
//       {
//         title: "Admin",
//         url: "/admin",
//         icon: UserCircle,
//         items: [],
//       },
//       // {
//       //   title: "Calendar",
//       //   url: "/calendar",
//       //   icon: Icons.Calendar,
//       //   items: [],
//       // },
//       // {
//       //   title: "Profile",
//       //   url: "/profile",
//       //   icon: Icons.User,
//       //   items: [],
//       // },
//       // {
//       //   title: "Forms",
//       //   icon: Icons.Alphabet,
//       //   items: [
//       //     {
//       //       title: "Form Elements",
//       //       url: "/forms/form-elements",
//       //     },
//       //     {
//       //       title: "Form Layout",
//       //       url: "/forms/form-layout",
//       //     },
//       //   ],
//       // },
//       // {
//       //   title: "Tables",
//       //   url: "/tables",
//       //   icon: Icons.Table,
//       //   items: [
//       //     {
//       //       title: "Tables",
//       //       url: "/tables",
//       //     },
//       //   ],
//       // },
//       // {
//       //   title: "Pages",
//       //   icon: Icons.Alphabet,
//       //   items: [
//       //     {
//       //       title: "Settings",
//       //       url: "/pages/settings",
//       //     },
//       //   ],
//       // },
//     ],
//   },
//   // {
//   //   label: "OTHERS",
//   //   items: [
//   //     {
//   //       title: "Charts",
//   //       icon: Icons.PieChart,
//   //       items: [
//   //         {
//   //           title: "Basic Chart",
//   //           url: "/charts/basic-chart",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       title: "UI Elements",
//   //       icon: Icons.FourCircle,
//   //       items: [
//   //         {
//   //           title: "Alerts",
//   //           url: "/ui-elements/alerts",
//   //         },
//   //         {
//   //           title: "Buttons",
//   //           url: "/ui-elements/buttons",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       title: "Authentication",
//   //       icon: Icons.Authentication,
//   //       items: [
//   //         {
//   //           title: "Sign In",
//   //           url: "/auth/sign-in",
//   //         },
//   //       ],
//   //     },
//   //   ],
//   // },
// ];

// export const NAV_DATA = addAdminPrefix(rawNavData);