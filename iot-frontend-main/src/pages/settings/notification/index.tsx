import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const MyNotificationComponent = dynamic(
  async () => {
    const { NotificationPage: MyNotificationModule } = await import("@/modules/settings");
    return MyNotificationModule;
  },
  { ssr: false }
);

const MyNotificationPage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyNotificationComponent />
    </DashboardLayout>
  );
};

export default MyNotificationPage;
