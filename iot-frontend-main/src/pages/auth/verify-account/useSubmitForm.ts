import { useEffect } from "react";

import useVerifyQuery from "@/services/auth/verify/useVerifyQuery";

interface IUseSubmitFormProps {
  token?: string;
}

export default function useSubmitForm({ ...props }: IUseSubmitFormProps) {
  const { handleSubmitVerifyAccount, isSuccessVerifyAccountData } = useVerifyQuery();

  const submitVerify = () => {
    if (props.token) {
      handleSubmitVerifyAccount({ token: props.token });
    }
  };

  useEffect(() => {
    if (props.token) {
      submitVerify();
    }
  }, [props.token]);

  return {
    isSuccessVerifyAccountData,
    submitVerify,
  };
}
