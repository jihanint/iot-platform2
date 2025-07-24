import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const CreateCalibrateDeviceComponent = dynamic(
  async () => {
    const DevicesModule = await import("@/modules/devices/calibrate/create/pages");
    return DevicesModule;
  },
  { ssr: false }
);

const CalibrateDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <CreateCalibrateDeviceComponent />
    </DashboardLayout>
  );
};

export default CalibrateDevicePage;
