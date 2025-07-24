import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const DevicesComponent = dynamic(
  async () => {
    const DevicesModule = await import("@/modules/devices/pages");
    return DevicesModule;
  },
  { ssr: false }
);

const DashboardPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DevicesComponent />
    </DashboardLayout>
  );
};

export default DashboardPage;
