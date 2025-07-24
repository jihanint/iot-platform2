import { type Control, Controller } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";

import { useRouter } from "next/router";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import HeaderTabs from "@/components/header/Tabs";
import type { TManagerListTabs } from "@/constants/headerTabs";
import { MANAGER_LIST_HEADER_TABS } from "@/constants/headerTabs";

import type { IFormDataManagerList } from "../useFilterValue";

export interface UserAssignmentManagerHeaderProps {
  control: Control<IFormDataManagerList>;
  activeTab: TManagerListTabs;
}

const UserAssignmentManagerHeader = ({ ...props }: UserAssignmentManagerHeaderProps) => {
  const { push } = useRouter();

  const handleRedirectToCreateSupervisor = () => {
    push("/user/assignment/manager/create");
  };
  return (
    <Flex direction="column" mb={3}>
      <Flex gap={2} mb={5}>
        <Controller
          control={props.control}
          name="activeTab"
          render={({ field: { onChange } }) => <HeaderTabs data={MANAGER_LIST_HEADER_TABS} onChange={onChange} />}
        />
      </Flex>
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Daftar Manajer
          </Text>
          <Text>
            Berikut adalah list manajer yang{" "}
            <span style={{ fontWeight: "bold" }}> {props.activeTab === "ASSIGNED_MANAGER" ? "sudah" : "belum"} </span>{" "}
            diberikan tugas.
          </Text>
        </Box>
        <Box>
          <Button leftIcon={<IoMdAdd />} size="sm" onClick={handleRedirectToCreateSupervisor}>
            Tambah Manager
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default UserAssignmentManagerHeader;
