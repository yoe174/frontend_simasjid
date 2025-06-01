// src\app\admin\kegiatan\page.tsx

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminTable from "@/components/admin/admin/AdminTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Kegiatan" />
      <AdminTable />
    </>
  );
};

export default CalendarPage;