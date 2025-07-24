import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import dayjs from "dayjs";

import type { GetStatusLogResponse } from "@/interfaces/device";
import { getIndonesianTimeDivision } from "@/utils/helper";

export interface IDevicesLogStatusTableProps {
  isSuccessGetDeviceStatusLog?: boolean;
  isStatusLogDataHasNextPage?: boolean;
  isFetchingGetDeviceStatusLog?: boolean;
  fetchDeviceStatusLogNextPage: () => void;
  deviceLogStatusData?: GetStatusLogResponse | undefined;
}

const DeviceLogStatusTable = ({ ...props }: IDevicesLogStatusTableProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && props.isStatusLogDataHasNextPage) {
      props.fetchDeviceStatusLogNextPage();
    }
  }, [inView, props.isStatusLogDataHasNextPage]);

  // TODO: clean up this component
  const content = props.deviceLogStatusData?.data?.map((log, i) => {
    if (props.deviceLogStatusData?.data?.length === i + 1) {
      return (
        <Tr key={i} ref={ref}>
          <Td>{log.id}</Td>
          <Td>{log.device_code}</Td>
          <Td>{log.rssi}</Td>
          <Td>{log.battery_current?.toFixed(2)} (mA)</Td>
          <Td>{log.battery_level?.toFixed(2)} (V)</Td>
          <Td>{log.battery_power} (mW)</Td>
          <Td>{log.lat}</Td>
          <Td>{log.long}</Td>
          <Td>{`${dayjs(log.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(log.created_at)}`}</Td>
        </Tr>
      );
    } else {
      return (
        <Tr key={i}>
          <Td>{log.id}</Td>
          <Td>{log.device_code}</Td>
          <Td>{log.rssi}</Td>
          <Td>{log.battery_current?.toFixed(2)} (mA)</Td>
          <Td>{log.battery_level?.toFixed(2)} (V)</Td>
          <Td>{log.battery_power} (mW)</Td>
          <Td>{log.lat}</Td>
          <Td>{log.long}</Td>
          <Td>{`${dayjs(log.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(log.created_at)}`}</Td>
        </Tr>
      );
    }
  });

  return (
    <Box>
      {/* <TableContainer> */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Device Code</Th>
            <Th>RSSI</Th>
            <Th>Battery Current</Th>
            <Th>Battery Level</Th>
            <Th>Battery Power</Th>
            <Th>Latitude</Th>
            <Th>Longitude</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>{content}</Tbody>
      </Table>
      {props.isFetchingGetDeviceStatusLog && "fetching..."}
    </Box>
  );
};

export default DeviceLogStatusTable;
