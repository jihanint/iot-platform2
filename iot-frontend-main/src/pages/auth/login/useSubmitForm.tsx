import { useState } from "react";

import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { useToast } from "@chakra-ui/react";

import type { IRequestLogin } from "@/services/auth/login/type";
import { handleApiError } from "@/utils/handler";

export default function useSubmitForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: IRequestLogin) => {
    // TODO: Implement when login can use phone and email
    // const identifierType = getIdentifierType(data.emailOrPhone);
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        emailOrPhone: data.emailOrPhone,
        password: data.password,
        type: data.type,
        redirect: false,
        callbackUrl: "/",
      });
      setIsLoading(false);

      if (result?.ok) {
        router.replace("/dashboard");
        setIsLoading(false);
      } else {
        throw new Error(result?.error || "Unknown Error");
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        status: "error",
        description: handleApiError(error),
      });
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
  };
}
