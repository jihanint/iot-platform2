import DataTable from "react-data-table-component";

import { Flex, Spinner } from "@chakra-ui/react";

import type { IUserUnassignedItem } from "@/services/user/assignment/type";

import { columns } from "./columns";

export interface IUserAssignmentManagerTableUnassignedProps {
  tableData: IUserUnassignedItem[];
  isFetchingUserUnassignedList: boolean;
  onRedirectToManagerDetail: (managerId: number) => void;
}

const UserAssignmentManagerTable = ({ ...props }: IUserAssignmentManagerTableUnassignedProps) => {
  if (props.isFetchingUserUnassignedList) {
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
      keyField="id"
      onRowClicked={row => {
        props.onRedirectToManagerDetail(row.user_id);
      }}
      responsive
      striped
      highlightOnHover
      pointerOnHover
      fixedHeader
    />
  );
};

export default UserAssignmentManagerTable;
