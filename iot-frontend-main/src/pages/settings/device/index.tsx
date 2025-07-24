import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const MyDeviceComponent = dynamic(
  async () => {
    const { DevicePage: MyDeviceModule } = await import("@/modules/settings");
    return MyDeviceModule;
  },
  { ssr: false }
);

const MyDevicePage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyDeviceComponent />
    </DashboardLayout>
  );
};

export default MyDevicePage;
