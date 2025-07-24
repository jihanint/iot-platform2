import { useEffect } from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchData from "./useFetchData";

const ModuleUserManagementSupervisor = dynamic(async () => await import("@/modules/user/assignment/Supervisor/pages"));

const PageUserManagementManager: NextPage = () => {
  const { supervisorAssignedListData } = useFetchData();
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Penugasan Pengawas");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserManagementSupervisor supervisorAssignedListData={supervisorAssignedListData} />
    </DashboardLayout>
  );
};

export default PageUserManagementManager;
