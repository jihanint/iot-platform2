import type { TableColumn } from "react-data-table-component";
import { BiEdit } from "react-icons/bi";

import { Flex, IconButton, Text } from "@chakra-ui/react";

import type { IUserUnassignedItem } from "@/services/user/assignment/type";

import DeleteManager from "../../delete/DeleteManager";
import { Village } from "../Assigned/columns";

export const columns: TableColumn<IUserUnassignedItem>[] = [
  {
    name: "Nama",
    sortable: true,
    selector: row => row.user_name,
    cell: row => <Text fontWeight="medium">{row.user_name}</Text>,
  },
  {
    name: "Alamat Email",
    sortable: true,
    selector: row => row.email,
    cell: row => <Text fontWeight="medium">{row.email}</Text>,
  },
  {
    name: "Nomor Handphone",
    sortable: true,
    selector: row => row.phone_number,
    cell: row => (
      <Text fontWeight="medium" textAlign="center">
        {row.phone_number ?? <span style={{ color: "#999" }}>[Tidak Ada]</span>}
      </Text>
    ),
  },
  {
    name: "Peran Anggota",
    sortable: true,
    selector: row => row.role,
    cell: row => <Text fontWeight="medium">{row.role}</Text>,
  },
  {
    name: "Action",
    sortable: true,
    selector: row => row.villages.map((village: Village) => village.name).join(", "),
    cell: row => (
      <Flex gap={2}>
        <IconButton
          color={"yellow.8"}
          icon={<BiEdit />}
          variant={"outline"}
          as={"a"}
          href={`/user/assignment/manager/edit/${row.user_id}`}
          w={8}
          h={8}
          minW={8}
          minH={8}
          aria-label="edit"
          p={0}
        />
        <DeleteManager role="Manager" userId={row.user_id} />
      </Flex>
    ),
  },
];
