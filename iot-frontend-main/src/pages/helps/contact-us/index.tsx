import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { DashboardLayout } from "@/common/layouts";

const ContactUsComponent = dynamic(
  async () => {
    const { ContactUs: ContactUsModule } = await import("@/modules/helps");
    return ContactUsModule;
  },
  { ssr: false }
);

const ContactUsPage: NextPage = () => {
  return (
    <DashboardLayout>
      <ContactUsComponent />
    </DashboardLayout>
  );
};

export default ContactUsPage;
