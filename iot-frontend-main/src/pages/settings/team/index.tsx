import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const MyTeamComponent = dynamic(
  async () => {
    const { TeamPage: MyTeamModule } = await import("@/modules/settings");
    return MyTeamModule;
  },
  { ssr: false }
);

const SettingsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyTeamComponent />
    </DashboardLayout>
  );
};

export default SettingsPage;
