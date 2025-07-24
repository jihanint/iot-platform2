import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import { handleAxiosError } from "@/utils/handler";

import { postRegisterAndAssignManger, postUserAssignment } from "./index";
import type { IRequestUserManagerAssignment } from "./type";

export default function useUserAssignmentMutation() {
  const toast = useToast();

  /**
   * Mutate: create a new manager also assign to the village
   * so manager doesn't need register process, account created manually
   */

  const {
    mutate: mutateUserMangerAssignment,
    data: mutateUserManagerAssignmentData,
    error: mutateUserManagerAssignmentError,
    isLoading: mutateUserManagerAssignmentLoading,
    isSuccess: mutateUserManagerAssignmentSuccess,
  } = useMutation({
    mutationKey: ["MUTATE_USER_MANAGER_ASSIGNMENT"],
    mutationFn: async (payload: IRequestUserManagerAssignment) => await postRegisterAndAssignManger(payload),
    onError: error => {
      toast({
        title: "Error",
        status: "error",
        description: handleAxiosError(error),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        status: "success",
        description: "Pengguna berhasil ditugaskan",
      });
    },
    cacheTime: 0,
  });

  /**
   * Mutate: post assignment data, adding village
   */
  const {
    mutate: mutateUserAssignment,
    data: mutateUserAssignmentData,
    error: mutateUserAssignmentError,
    isLoading: mutateUserAssignmentLoading,
    isSuccess: mutateUserAssignmentSuccess,
    mutateAsync: mutateAsyncUserAssignment,
  } = useMutation({
    // TODO: don't use any
    mutationFn: async (payload: any) => await postUserAssignment(payload),
    mutationKey: ["MUTATE_USER_ASSIGNMENT"],
    onError: error => {
      toast({
        title: "Error",
        status: "error",
        description: handleAxiosError(error),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        status: "success",
        description: "Pengguna berhasil ditugaskan",
      });
    },
    cacheTime: 0,
  });

  return {
    // POST
    mutateUserAssignment,
    mutateAsyncUserAssignment,
    mutateUserAssignmentData,
    mutateUserAssignmentError,
    mutateUserAssignmentLoading,
    mutateUserAssignmentSuccess,
    //
    mutateUserMangerAssignment,
    mutateUserManagerAssignmentData,
    mutateUserManagerAssignmentError,
    mutateUserManagerAssignmentLoading,
    mutateUserManagerAssignmentSuccess,
  };
}
