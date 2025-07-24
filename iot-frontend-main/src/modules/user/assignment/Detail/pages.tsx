import React from "react";

import { ContentContainer } from "@/common/layouts";

import type { IUserAssignmentDetailFormProps } from "./Form";
import UserAssignmentDetailForm from "./Form";
import UserAssignmentDetailHeader from "./Header";

interface IModuleUserAssignmentDetailProps extends IUserAssignmentDetailFormProps {
  isEditable?: boolean;
}

const ModuleUserAssignmentDetail = (props: IModuleUserAssignmentDetailProps) => {
  return (
    <ContentContainer position="relative">
      <UserAssignmentDetailHeader />
      <UserAssignmentDetailForm
        isEditable={props.isEditable}
        userDetail={props.userDetail}
        onSubmitUserAssignment={props.onSubmitUserAssignment}
      />
    </ContentContainer>
  );
};

export default ModuleUserAssignmentDetail;
