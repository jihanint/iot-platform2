import { useEffect, useMemo } from "react";

import useUserAssignmentQuery from "@/services/user/assignment/useUserAssignmentQuery";

export default function useFetchData() {
  const { userAssignedListData, refetchUserAssignedList } = useUserAssignmentQuery();

  const filteredSupervisorRole = useMemo(() => {
    if (userAssignedListData) {
      return userAssignedListData?.filter(user => user.role === "SUPERVISOR");
    }
    return [];
  }, [userAssignedListData]);

  useEffect(() => {
    refetchUserAssignedList();
  }, []);

  return {
    supervisorAssignedListData: filteredSupervisorRole || [],
  };
}
