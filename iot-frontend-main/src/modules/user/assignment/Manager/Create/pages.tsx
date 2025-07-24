import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { ContentContainer } from "@/common/layouts";

import type { IUserAssignmentManagerCreateFormProps } from "./Form";
import UserAssignmentManagerCreateForm from "./Form";
import UserAssignmentManagerCreateHeader from "./Header";

interface IModuleUserAssignmentManagerCreateProps extends IUserAssignmentManagerCreateFormProps {
  isSuccessMutateUserManagerAssignment?: boolean;
}

export default function ModuleUserAssignmetMangerCreate(props: IModuleUserAssignmentManagerCreateProps) {
  const { push } = useRouter();
  useEffect(() => {
    if (props.isSuccessMutateUserManagerAssignment) {
      push("/user/assignment/manager");
    }
  }, [props.isSuccessMutateUserManagerAssignment]);
  return (
    <ContentContainer>
      <UserAssignmentManagerCreateHeader />
      <UserAssignmentManagerCreateForm onSubmitUserManagerAssignment={props.onSubmitUserManagerAssignment} />
    </ContentContainer>
  );
}
