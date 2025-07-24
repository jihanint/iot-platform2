import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const CalibrateDevicesComponent = dynamic(
  async () => {
    const DevicesModule = await import("@/modules/devices/calibrate/pages");
    return DevicesModule;
  },
  { ssr: false }
);

const CalibrateDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <CalibrateDevicesComponent />
    </DashboardLayout>
  );
};

export default CalibrateDevicePage;
