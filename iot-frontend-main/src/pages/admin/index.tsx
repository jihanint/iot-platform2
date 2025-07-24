import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const AdminComponent = dynamic(
  async () => {
    const AdminModule = await import("@/modules/admin/pages");
    return AdminModule;
  },
  { ssr: false }
);

const DashboardPage: NextPage = () => {
  return (
    <DashboardLayout>
      <AdminComponent />
    </DashboardLayout>
  );
};

export default DashboardPage;
