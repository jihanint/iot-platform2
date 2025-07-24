import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import { handleAxiosError } from "@/utils/handler";

import { register } from "./index";
import type { IRequestRegister } from "./type";

export default function useRegisterQuery() {
  const toast = useToast();
  const {
    mutate: mutateRegister,
    mutateAsync: mutateAsyncRegister,
    data: mutateRegisterData,
    error: mutateRegisterError,
    isLoading: mutateRegisterLoading,
    isSuccess: mutateRegisterSuccess,
  } = useMutation({
    mutationFn: async (payload: IRequestRegister) => await register(payload),
    onError: error => {
      toast({
        title: "Error",
        status: "error",
        description: handleAxiosError(error),
      });
    },
  });

  const handleSubmitRegister = async (formData: IRequestRegister) => {
    try {
      await mutateRegister(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    mutateRegister,
    handleSubmitRegister,
    mutateRegisterData,
    mutateRegisterError,
    mutateRegisterLoading,
    mutateRegisterSuccess,
  };
}
