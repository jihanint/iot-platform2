import React from "react";
import { type Control } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";

import { useRouter } from "next/router";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import type { TSupervisorListTabs } from "@/constants/headerTabs";

import type { IFormDataSupervisorList } from "../useFilterValue";

export interface UserAssignmentSupervisorHeaderProps {
  control: Control<IFormDataSupervisorList>;
  activeTab: TSupervisorListTabs;
}

// TODO: implement when need tab page
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserAssignmentSupervisorHeader = ({ ...props }: UserAssignmentSupervisorHeaderProps) => {
  const { push } = useRouter();

  const handleRedirectToCreateSupervisor = () => {
    push("/user/assignment/supervisor/create");
  };
  return (
    <Flex direction="column" mb={3}>
      {/* TODO: for future feature if use more tab */}
      {/* <Flex gap={2} mb={5}>
        <Controller
          control={props.control}
          name="activeTab"
          render={({ field: { onChange } }) => <HeaderTabs data={SUUPERVISOR_LIST_HEADER_TABS} onChange={onChange} />}
        />
      </Flex> */}
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Daftar Pengawas
          </Text>
          <Text>Berikut adalah list pengawas lapangan yang sudah diberikan tugas.</Text>
        </Box>
        <Box>
          <Button leftIcon={<IoMdAdd />} size="sm" onClick={handleRedirectToCreateSupervisor}>
            Tambah Pengawas
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default UserAssignmentSupervisorHeader;
