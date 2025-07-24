import { useRouter } from "next/router";

import { ContentContainer } from "@/common/layouts";
import type { IUserAssignmentItem, IUserUnassignedItem } from "@/services/user/assignment/type";

import UserAssignmentManagerHeader from "./Header";
import type { IUserAssignmentManagerTableAssignedProps } from "./Table/Assigned";
import UserAssignedManagerTable from "./Table/Assigned";
import type { IUserAssignmentManagerTableUnassignedProps } from "./Table/Unassigned";
import UserUnassignedManagerTable from "./Table/Unassigned";
import type { IFormDataManagerList } from "./useFilterValue";
import useFilterValue from "./useFilterValue";

interface ModuleUserManagementManagerProps
  extends Pick<IUserAssignmentManagerTableAssignedProps, "isFetchingUserAssignedList">,
    Pick<IUserAssignmentManagerTableUnassignedProps, "isFetchingUserUnassignedList"> {
  managerAssignedListData: IUserAssignmentItem[];
  managerUnassignedListData: IUserUnassignedItem[];
  onChangeFilter: (data: IFormDataManagerList) => void;
}

const ModuleUserManagementManager = (props: ModuleUserManagementManagerProps) => {
  const { activeTab, control } = useFilterValue({ onChangeFilter: props.onChangeFilter });
  const { push } = useRouter();

  const handleRedirectToManagerDetail = (managerId: number) => {
    push(`/user/assignment/manager/detail/${managerId}`);
  };

  return (
    <ContentContainer position="relative">
      <UserAssignmentManagerHeader control={control} activeTab={activeTab} />
      {activeTab === "ASSIGNED_MANAGER" && (
        <UserAssignedManagerTable
          tableData={props.managerAssignedListData}
          isFetchingUserAssignedList={props.isFetchingUserAssignedList}
          onRedirectToManagerDetail={handleRedirectToManagerDetail}
        />
      )}
      {activeTab === "UNASSIGNED_MANAGER" && (
        <UserUnassignedManagerTable
          tableData={props.managerUnassignedListData}
          isFetchingUserUnassignedList={props.isFetchingUserUnassignedList}
          onRedirectToManagerDetail={handleRedirectToManagerDetail}
        />
      )}
    </ContentContainer>
  );
};

export default ModuleUserManagementManager;
