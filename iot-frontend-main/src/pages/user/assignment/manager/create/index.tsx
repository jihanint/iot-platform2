import React, { useEffect } from "react";

import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchAssignmentData from "../../useFetchAssignmentData";

const ModuleUserManagerCreate = dynamic(async () => await import("@/modules/user/assignment/Manager/Create/pages"));

const PageUserAssignmentManagerCreate = () => {
  const { setBreadCrumb } = useLayoutState();
  const { isSuccessMutateUserManagerAssignment, handleSubmitAssignNewManager } = useFetchAssignmentData();

  useEffect(() => {
    setBreadCrumb("Buat Manager Baru");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserManagerCreate
        onSubmitUserManagerAssignment={handleSubmitAssignNewManager}
        isSuccessMutateUserManagerAssignment={isSuccessMutateUserManagerAssignment}
      />
    </DashboardLayout>
  );
};

export default PageUserAssignmentManagerCreate;
