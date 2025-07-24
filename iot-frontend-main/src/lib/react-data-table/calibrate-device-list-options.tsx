import type { TableColumn } from "react-data-table-component";

import Link from "next/link";

import { Button, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

import { StatusBadge } from "@/common/components";
import type { CalibrateDeviceData } from "@/interfaces/device";
import { getIndonesianTimeDivision } from "@/utils/helper";

export const columns: TableColumn<CalibrateDeviceData>[] = [
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
    name: "Kalibrasi Water Level",
    sortable: true,
    style: {
      minWidth: "180px",
    },
    selector: row => row.water_level_calibration_status,
    cell: row => {
      return <StatusBadge badgeStatus={row.water_level_calibration_status === 0 ? 6 : 5} />;
    },
  },
  {
    name: "Kalibrasi Water Flow",
    sortable: true,
    style: {
      minWidth: "180px",
    },
    selector: row => row.water_flow_calibration_status,
    cell: row => {
      return <StatusBadge badgeStatus={row.water_flow_calibration_status === 0 ? 6 : 5} />;
    },
  },
  {
    name: "Tanggal Kalibrasi",
    sortable: true,
    selector: row => row.calibration_date,
    format: row =>
      `${dayjs(row.calibration_date).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(row.calibration_date)}`,
  },
  {
    name: "Action",

    selector: row => row.device_id,
    cell: row => {
      return (
        <Link href={`/devices/calibrate/create/${row.device_id}`}>
          <Button borderRadius={"xl"} size={"sm"} bgColor={"green.11"}>
            Kalibrasi Perangkat
          </Button>
        </Link>
      );
    },
  },
];
