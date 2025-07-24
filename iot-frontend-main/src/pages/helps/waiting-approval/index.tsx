import { NextPage } from "next";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/common/layouts";

const WaitingApprovalComponent = dynamic(
  async () => {
    const { WaitingApproval: WaitingApprovalModule } = await import("@/modules/helps");
    return WaitingApprovalModule;
  },
  { ssr: false }
);

const WaitingApprovalPage: NextPage = () => {
  return (
    <DashboardLayout>
      <WaitingApprovalComponent />
    </DashboardLayout>
  );
};

export default WaitingApprovalPage;
