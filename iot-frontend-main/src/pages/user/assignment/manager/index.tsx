import { useEffect } from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchData from "./useFetchData";

const ModuleUserManagementManager = dynamic(async () => await import("@/modules/user/assignment/Manager/pages"));

const PageUserManagementManager: NextPage = () => {
  const {
    managerAssignedListData,
    managerUnassignedListData,
    isFetchingUserAssignedList,
    isFetchingUserUnassignedList,
    handleChangeFilter,
  } = useFetchData();

  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Penugasan Manajer");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserManagementManager
        managerAssignedListData={managerAssignedListData}
        managerUnassignedListData={managerUnassignedListData}
        onChangeFilter={handleChangeFilter}
        isFetchingUserAssignedList={isFetchingUserAssignedList}
        isFetchingUserUnassignedList={isFetchingUserUnassignedList}
      />
    </DashboardLayout>
  );
};

export default PageUserManagementManager;
