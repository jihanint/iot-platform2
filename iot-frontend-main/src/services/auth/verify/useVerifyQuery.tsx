import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import { handleAxiosError } from "@/utils/handler";

import { verify } from "./index";
import type { IRequestVerifyAccount } from "./type";

export default function useVerifyQuery() {
  const toast = useToast();

  const {
    mutate: mutateVerifyAccount,
    data: mutateVerifyAccountData,
    isSuccess: isSuccessVerifyAccountData,
  } = useMutation({
    mutationFn: async (payload: IRequestVerifyAccount) => await verify(payload),
    onError: error => {
      toast({
        title: "Error",
        status: "error",
        description: handleAxiosError(error),
      });
    },
  });

  const handleSubmitVerifyAccount = (payload: IRequestVerifyAccount) => {
    console.log("called");
    mutateVerifyAccount(payload);
  };

  return {
    mutateVerifyAccountData,
    isSuccessVerifyAccountData,
    handleSubmitVerifyAccount,
  };
}
