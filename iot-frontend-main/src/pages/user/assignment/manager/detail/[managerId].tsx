import { useEffect } from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";

import useFetchAssignmentData from "../../useFetchAssignmentData";
import useFetchManagerDetail from "./useFetchManagerDetail";

const ModuleUserManagerDetail = dynamic(async () => await import("@/modules/user/assignment/Detail/pages"));

const PageUserManagementManagerDetail: NextPage = () => {
  const { setBreadCrumb } = useLayoutState();

  const { userDetail } = useFetchManagerDetail();

  const { handleSubmitUserAssignment } = useFetchAssignmentData();

  useEffect(() => {
    setBreadCrumb("Detail Manajer");
  }, []);

  return (
    <DashboardLayout>
      <ModuleUserManagerDetail userDetail={userDetail?.data} onSubmitUserAssignment={handleSubmitUserAssignment} />
    </DashboardLayout>
  );
};

export default PageUserManagementManagerDetail;
