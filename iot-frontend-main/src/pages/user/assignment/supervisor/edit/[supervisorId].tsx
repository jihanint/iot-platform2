import { useEffect } from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchAssignmentData from "../../useFetchAssignmentData";
import useFetchSupervisorDetail from "./../detail/useFetchSupervisorDetail";

const ModuleUserSupervisorDetail = dynamic(async () => await import("@/modules/user/assignment/Detail/pages"));

const PageUserManagementManagerDetail: NextPage = () => {
  const { setBreadCrumb } = useLayoutState();

  const { userDetail } = useFetchSupervisorDetail();

  const { handleSubmitUserAssignment } = useFetchAssignmentData();

  useEffect(() => {
    setBreadCrumb("Edit Pengawas");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserSupervisorDetail
        isEditable
        userDetail={userDetail?.data}
        onSubmitUserAssignment={handleSubmitUserAssignment}
      />
    </DashboardLayout>
  );
};

export default PageUserManagementManagerDetail;
