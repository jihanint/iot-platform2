import { useRouter } from "next/router";

import { ContentContainer } from "@/common/layouts";
import type { IUserAssignmentItem } from "@/services/user/assignment/type";

import UserAssignmentSupervisorHeader from "./Header";
import type { IUserAssignmentSupervisorTableAssignedProps } from "./Table/Assigned";
import UserAssignedManagerTable from "./Table/Assigned";
import useFilterValue from "./useFilterValue";

interface ModuleUserManagementManagerProps
  extends Pick<IUserAssignmentSupervisorTableAssignedProps, "isFetchingUserAssignedList"> {
  supervisorAssignedListData: IUserAssignmentItem[];
}
const ModuleUserManagementSupervisor = (props: ModuleUserManagementManagerProps) => {
  const { push } = useRouter();
  const { activeTab, control } = useFilterValue();

  const handleRedirectToSupervisorDetail = (supervisorId: number) => {
    push(`/user/assignment/supervisor/detail/${supervisorId}`);
  };

  return (
    <ContentContainer position="relative">
      <UserAssignmentSupervisorHeader control={control} activeTab={activeTab} />
      <UserAssignedManagerTable
        tableData={props.supervisorAssignedListData}
        onRedirectToSupervisorDetail={handleRedirectToSupervisorDetail}
        isFetchingUserAssignedList={props.isFetchingUserAssignedList}
      />
    </ContentContainer>
  );
};

export default ModuleUserManagementSupervisor;
