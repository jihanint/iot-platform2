import DataTable from "react-data-table-component";

import { Flex, Spinner } from "@chakra-ui/react";

import type { IUserAssignmentItem } from "@/services/user/assignment/type";

import { columns } from "./columns";

export interface IUserAssignmentManagerTableAssignedProps {
  tableData: IUserAssignmentItem[];
  isFetchingUserAssignedList?: boolean;
  onRedirectToManagerDetail: (managerId: number) => void;
}

const UserAssignmentManagerTable = ({ ...props }: IUserAssignmentManagerTableAssignedProps) => {
  if (props.isFetchingUserAssignedList) {
    return (
      <Flex w="full" py={8} justify="center">
        <Spinner />
      </Flex>
    );
  }
  if (!props.tableData) {
    return <></>;
  }
  return (
    <DataTable
      columns={columns}
      data={props.tableData}
      onRowClicked={row => {
        props.onRedirectToManagerDetail(row.user_id);
      }}
      keyField="id"
      responsive
      striped
      highlightOnHover
      pointerOnHover
      fixedHeader
    />
  );
};

export default UserAssignmentManagerTable;
