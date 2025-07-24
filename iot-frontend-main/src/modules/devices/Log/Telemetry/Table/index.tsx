import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import dayjs from "dayjs";

import type { IResponseListApi } from "@/interfaces/common/list";
import type { IWaterTelemetryLogItem } from "@/services/log/type";
import { getIndonesianTimeDivision } from "@/utils/helper";

export interface IDeviceLogTelemetryTableProps {
  isSuccessGetWaterTelemetryLog?: boolean;
  isWaterTelemetryLogDataHasNextPage?: boolean;
  isFetchingGetWaterTelemetryLog?: boolean;
  fetchWaterTelemetryLogNextPage: () => void;
  refetchWaterTelemetryLog: () => void;
  deviceLogTelemetryData?: IResponseListApi<IWaterTelemetryLogItem> | undefined;
}

const DeviceLogTelemetryTable = ({ ...props }: IDeviceLogTelemetryTableProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && props.isWaterTelemetryLogDataHasNextPage) {
      props.fetchWaterTelemetryLogNextPage();
    }
  }, [inView, props.isWaterTelemetryLogDataHasNextPage]);

  // TODO: clean up this component
  const content =
    props.isSuccessGetWaterTelemetryLog &&
    props.deviceLogTelemetryData?.data?.map((log, i) => {
      if (props.deviceLogTelemetryData?.data?.length === i + 1) {
        return (
          <Tr key={log.id} ref={ref}>
            <Td>{log.id}</Td>
            <Td>{log.device_code}</Td>
            <Td>
              {log.inflow.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (m³/hr)
            </Td>
            <Td>
              {log.outflow?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (L/Min)
            </Td>
            <Td>{log.level / 10}</Td>
            <Td>
              {log.involume?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (mL)
            </Td>
            <Td>
              {log.outvolume?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (mL)
            </Td>
            <Td>{`${dayjs(log.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(log.created_at)}`}</Td>
          </Tr>
        );
      } else {
        return (
          <Tr key={i} ref={ref}>
            <Td>{log.id}</Td>
            <Td>{log.device_code}</Td>
            <Td>
              {log.inflow?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (m³/hr)
            </Td>
            <Td>
              {log.outflow?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (L/Min)
            </Td>
            <Td>{log.level / 10}</Td>
            <Td>
              {log.involume?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (mL)
            </Td>
            <Td>
              {log.outvolume?.map((x, y) => (
                <span key={y}>
                  {y > 0 && ", "}
                  {x.toFixed(2)}
                </span>
              ))}{" "}
              (mL)
            </Td>
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
            <Th>In Flow</Th>
            <Th>Out Flow</Th>
            <Th>Level</Th>
            <Th>In Volume</Th>
            <Th>Out Volume</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>{content}</Tbody>
      </Table>
      {props.isFetchingGetWaterTelemetryLog && "fetching..."}
    </Box>
  );
};

export default DeviceLogTelemetryTable;
