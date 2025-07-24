import { useEffect } from "react";

import { useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { handleAxiosError } from "@/utils/handler";

import { getUserAssignedList, getUserUnassignedList } from "./index";

export default function useUserAssignmentQuery() {
  const toast = useToast();

  /**
   * Get: User assignment list data
   */
  const {
    data: userAssignedListData,
    isFetching: isFetchingUserAssignedList,
    error: errorFetchingUserAssignedList,
    isError: isErrorFetchingUserAssignedList,
    refetch: refetchUserAssignedList,
  } = useQuery({
    queryKey: ["USER_ASSIGNED_LIST"],
    queryFn: () => getUserAssignedList(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
    staleTime: 0,
    networkMode: "always",
    enabled: false, // this for preventing auto fetch on component mount, will use refetch instead
  });

  /**
   * Get: User unassigned list data
   */
  const {
    data: userUnassignedListData,
    isFetching: isFetchingUserUnassignedList,
    error: errorFetchingUserUnassignedList,
    isError: isErrorFetchingUserUnassignedList,
    refetch: refetchUserUnassignedList,
  } = useQuery({
    queryKey: ["USER_UNASSIGNED_LIST"],
    queryFn: () => getUserUnassignedList(),
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
    networkMode: "always",
    enabled: false,
  });

  useEffect(() => {
    if (isErrorFetchingUserAssignedList || isErrorFetchingUserUnassignedList) {
      toast({
        title: "Error",
        status: "error",
        description:
          handleAxiosError(errorFetchingUserAssignedList) || handleAxiosError(errorFetchingUserUnassignedList),
      });
    }
  }, [
    isErrorFetchingUserAssignedList,
    isErrorFetchingUserUnassignedList,
    errorFetchingUserUnassignedList,
    errorFetchingUserAssignedList,
  ]);

  return {
    isFetchingUserUnassignedList,
    userUnassignedListData: userUnassignedListData?.data,
    isFetchingUserAssignedList,
    userAssignedListData: userAssignedListData?.data,
    isErrorFetchingUserAssignedList,
    refetchUserAssignedList,
    refetchUserUnassignedList,
  };
}
