import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import useSubmitForm from "./useSubmitForm";

const ModuleAuthVerifyAccount = dynamic(async () => await import("@/modules/auth/VerifyAccount/pages"));

const PageAuthRegister: NextPage = () => {
  const { query } = useRouter();
  const { token, email } = query;

  const { isSuccessVerifyAccountData, submitVerify } = useSubmitForm({ token: token as string });

  return (
    <ModuleAuthVerifyAccount
      isSuccessVerifyAccountData={isSuccessVerifyAccountData}
      onSubmitVerify={submitVerify}
      emailAddress={email as string}
      tokenData={token as string}
    />
  );
};

export default PageAuthRegister;
