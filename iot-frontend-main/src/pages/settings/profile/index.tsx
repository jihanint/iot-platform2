import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const MyProfileComponent = dynamic(
  async () => {
    const { ProfilePage: MyProfileModule } = await import("@/modules/settings");
    return MyProfileModule;
  },
  { ssr: false }
);

const SettingsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyProfileComponent />
    </DashboardLayout>
  );
};

export default SettingsPage;
