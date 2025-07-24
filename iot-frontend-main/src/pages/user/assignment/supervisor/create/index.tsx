import React, { useEffect } from "react";

import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchAssignmentData from "../../useFetchAssignmentData";

const ModuleUserSupervisorCreate = dynamic(
  async () => await import("@/modules/user/assignment/Supervisor/Create/pages")
);

const PageUserAssignmentSupervisorCreate = () => {
  const { setBreadCrumb } = useLayoutState();
  const { handleSubmitUserAssignment } = useFetchAssignmentData();

  useEffect(() => {
    setBreadCrumb("Buat Pengawas Baru");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserSupervisorCreate onSubmitUserAssignment={handleSubmitUserAssignment} />
    </DashboardLayout>
  );
};

export default PageUserAssignmentSupervisorCreate;
