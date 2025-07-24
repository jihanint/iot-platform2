import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const VillageDeviceModuleComponent = dynamic(
  async () => {
    const VillageDeviceModule = await import("@/modules/devices/village-device/pages");
    return VillageDeviceModule;
  },
  { ssr: false }
);

const VillageDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <VillageDeviceModuleComponent />
    </DashboardLayout>
  );
};

export default VillageDevicePage;
