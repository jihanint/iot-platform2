import type { NextPage } from "next";
import dynamic from "next/dynamic";

import useSubmitForm from "./useSubmitForm";

const ModuleAuthRegister = dynamic(async () => await import("@/modules/auth/Register/pages"));

const PageAuthRegister: NextPage = () => {
  const { handleSubmit } = useSubmitForm();
  return <ModuleAuthRegister onSubmit={handleSubmit} />;
};

export default PageAuthRegister;
