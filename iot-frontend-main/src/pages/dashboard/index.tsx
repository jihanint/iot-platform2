import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const DashboardComponent = dynamic(
  async () => {
    const DashboardModule = await import("@/modules/dashboard/pages");
    return DashboardModule;
  },
  { ssr: false }
);

const DashboardPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
};

export default DashboardPage;
