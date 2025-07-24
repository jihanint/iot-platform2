import type { NextPage } from "next";
import dynamic from "next/dynamic";

import useSubmitForm from "./useSubmitForm";

const ModuleAuthLogin = dynamic(async () => await import("@/modules/auth/Login/pages"), { ssr: false });

const PageAuthLogin: NextPage = () => {
  const { onSubmit, isLoading } = useSubmitForm();

  return <ModuleAuthLogin onSubmit={onSubmit} submitLoading={isLoading} />;
};

export default PageAuthLogin;
