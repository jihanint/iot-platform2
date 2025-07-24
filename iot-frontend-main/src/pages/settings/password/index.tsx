import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const MyPasswordComponent = dynamic(
  async () => {
    const { PasswordPage: MyPasswordModule } = await import("@/modules/settings");
    return MyPasswordModule;
  },
  { ssr: false }
);

const MyPasswordPage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyPasswordComponent />
    </DashboardLayout>
  );
};

export default MyPasswordPage;
