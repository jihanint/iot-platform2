import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const DetailCalibratedDeviceComponent = dynamic(
  async () => {
    const DevicesModule = await import("@/modules/devices/calibrate/detail/pages");
    return DevicesModule;
  },
  { ssr: false }
);

const DetailCalibratedDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <DetailCalibratedDeviceComponent />
    </DashboardLayout>
  );
};

export default DetailCalibratedDevicePage;
