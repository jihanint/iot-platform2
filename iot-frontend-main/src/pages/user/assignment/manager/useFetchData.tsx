import { useMemo } from "react";

import type { IFormDataManagerList } from "@/modules/user/assignment/Manager/useFilterValue";
import useUserAssignmentQuery from "@/services/user/assignment/useUserAssignmentQuery";

export default function useFetchData() {
  const {
    userAssignedListData,
    userUnassignedListData,
    isFetchingUserAssignedList,
    isFetchingUserUnassignedList,
    refetchUserAssignedList,
    refetchUserUnassignedList,
  } = useUserAssignmentQuery();

  const handleChangeFilter = (data: IFormDataManagerList) => {
    if (data.activeTab === "ASSIGNED_MANAGER") {
      refetchUserAssignedList();
    } else if (data.activeTab === "UNASSIGNED_MANAGER") {
      refetchUserUnassignedList();
    }
  };

  const filteredManagerRole = useMemo(() => {
    if (userAssignedListData) {
      return userAssignedListData?.filter(user => user.role === "MANAGER");
    }
    return [];
  }, [userAssignedListData]);

  return {
    managerAssignedListData: filteredManagerRole || [],
    managerUnassignedListData: userUnassignedListData || [],
    isFetchingUserAssignedList,
    isFetchingUserUnassignedList,
    handleChangeFilter,
  };
}
