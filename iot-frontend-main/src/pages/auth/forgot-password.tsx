import type { NextPage } from "next";
import dynamic from "next/dynamic";

const ForgotPasswordComponent = dynamic(
  async () => {
    const { ForgotPassword: ForgotPasswordModule } = await import("@/modules/auth");
    return ForgotPasswordModule;
  },
  {
    ssr: false,
  }
);

const ForgotPasswordPage: NextPage = () => {
  return <ForgotPasswordComponent />;
};

export default ForgotPasswordPage;
