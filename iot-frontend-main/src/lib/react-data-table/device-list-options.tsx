import type { TableColumn } from "react-data-table-component";

import { Text } from "@chakra-ui/react";
import dayjs from "dayjs";

import { StatusBadge } from "@/common/components";
import type { DeviceData } from "@/interfaces/device";
import ActionColumn from "@/modules/devices/components/ActionColumn";
import { getIndonesianTimeDivision } from "@/utils/helper";

export const columns: TableColumn<DeviceData>[] = [
  {
    name: "Nama Desa",
    sortable: true,
    selector: row => row.village_name,
    cell: row => <Text fontWeight="medium">{row.village_name}</Text>,
  },
  {
    name: "Kabupaten",
    sortable: true,
    selector: row => row.city,
  },
  {
    name: "Tanggal Pemasangan",
    sortable: true,
    selector: row => row.installation_date,
    format: row =>
      `${dayjs(row.installation_date).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(row.installation_date)}`,
  },
  {
    name: "Data Terakhir",
    sortable: true,
    selector: row => row.last_update,
    format: row => `${dayjs(row.last_update).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(row.last_update)}`,
  },
  {
    name: "Status",
    sortable: true,
    selector: row => row.status,
    style: {
      minWidth: "180px",
    },
    cell: row => {
      return <StatusBadge badgeStatus={row.status} />;
    },
  },
  {
    name: "Action",

    selector: row => row.status,
    cell: row => {
      return <ActionColumn deviceId={row.device_id as number} />;
    },
  },
];
