import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { dayjs } from "@/lib/dayjs";
import { getDeviceStatusLog } from "@/services/device";
import { getIndonesianTimeDivision } from "@/utils/helper";

// TODO: remove this comonent because unused (moved to device module)
const TelemetryListTable = () => {
  const LIMIT = 10;
  const { ref, inView } = useInView();
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["get_infinite_device_status_log_data"],
    queryFn: ({ pageParam = 1 }) => {
      return getDeviceStatusLog({ page_number: pageParam, page_size: LIMIT });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.data.length === LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data?.pages?.map(
      page =>
        page?.data?.map((log, i) => {
          if (page.data.length === i + 1) {
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
                <Td>{`${dayjs(log.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  log.created_at
                )}`}</Td>
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
                <Td>{`${dayjs(log.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  log.created_at
                )}`}</Td>
              </Tr>
            );
          }
        })
    );

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
      {isFetchingNextPage && "fetching..."}
    </Box>
  );
};

export default TelemetryListTable;
