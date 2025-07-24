import React from "react";

import { ContentContainer } from "@/common/layouts";

import type { IUserAssignmentSupervisorCreateFormProps } from "./Form";
import UserAssignmentSupervisorCreateForm from "./Form";
import UserAssignmentSupervisorCreateHeader from "./Header";

interface IUserAssignmentSupervisorCreateProps extends IUserAssignmentSupervisorCreateFormProps {}

const ModuleUserAssignmentSupervisorCreate = (props: IUserAssignmentSupervisorCreateProps) => {
  return (
    <ContentContainer position="relative">
      <UserAssignmentSupervisorCreateHeader />
      <UserAssignmentSupervisorCreateForm onSubmitUserAssignment={props.onSubmitUserAssignment} />
    </ContentContainer>
  );
};
export default ModuleUserAssignmentSupervisorCreate;
