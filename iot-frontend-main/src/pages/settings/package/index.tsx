import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const MyPackageComponent = dynamic(
  async () => {
    const { PackagePage: MyPackageModule } = await import("@/modules/settings");
    return MyPackageModule;
  },
  { ssr: false }
);

const MyPackagePage: NextPage = () => {
  return (
    <DashboardLayout>
      <MyPackageComponent />
    </DashboardLayout>
  );
};

export default MyPackagePage;
