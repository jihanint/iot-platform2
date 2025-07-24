import type { TableColumn } from "react-data-table-component";

import { Text } from "@chakra-ui/react";

import { StatusBadge } from "@/common/components";
import { dayjs } from "@/lib/dayjs";
import { getIndonesianTimeDivision } from "@/utils/helper";

type DataRow = {
  id: number;
  date_time: string;
  values: number;
  status: number;
};

const useWaterTableOptions = ({ columnValueTitle = "COLUMN_NAME" }: { columnValueTitle?: string }) => {
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Jam",
      sortable: true,
      selector: row => row.date_time,
      cell: row => (
        <Text fontWeight="medium">{`${dayjs(row.date_time).format("hh:MM")} ${getIndonesianTimeDivision(
          row.date_time
        )}`}</Text>
      ),
    },
    {
      name: "Tanggal",
      sortable: true,
      selector: row => `${dayjs(row.date_time).format("DD/MM/YY")}`,
    },
    {
      name: columnValueTitle,
      sortable: true,
      selector: row => row.values,
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return <StatusBadge badgeStatus={row.status} />;
      },
    },
  ];

  return {
    columns,
  };
};

export default useWaterTableOptions;
