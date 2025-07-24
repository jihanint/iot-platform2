import { useEffect } from "react";

import { useRouter } from "next/router";

import type { IRequestRegister } from "@/services/auth/register/type";
import useRegisterQuery from "@/services/auth/register/useRegisterQuery";

export default function useSubmitForm() {
  const router = useRouter();
  const { handleSubmitRegister, mutateRegisterData, mutateRegisterLoading, mutateRegisterSuccess } = useRegisterQuery();

  useEffect(() => {
    if (mutateRegisterSuccess && mutateRegisterData?.data) {
      router.push(
        `/auth/verify-account?email=${mutateRegisterData?.data?.email}&fullname=${mutateRegisterData?.data?.fullname}`
      );
    }
  }, [mutateRegisterSuccess, mutateRegisterData?.data]);

  const handleSubmit = (formData: IRequestRegister) => {
    handleSubmitRegister(formData);
  };

  return {
    handleSubmit,
    isLoading: mutateRegisterLoading,
  };
}
