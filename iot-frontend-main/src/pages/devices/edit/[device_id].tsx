import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const CreateDeviceModuleComponent = dynamic(
  async () => {
    const CreateDeviceModule = await import("@/modules/devices/edit/pages");
    return CreateDeviceModule;
  },
  { ssr: false }
);

const CreateDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <CreateDeviceModuleComponent />
    </DashboardLayout>
  );
};

export default CreateDevicePage;
