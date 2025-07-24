import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { dayjs } from "@/lib/dayjs";
import { getTelemetryListData } from "@/services/water";
import { getIndonesianTimeDivision } from "@/utils/helper";

// TODO: remove this comonent because unused (moved to device module)
const TelemetryListTable = () => {
  const LIMIT = 10;
  const { ref, inView } = useInView();
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["get_infinite_telemetry_data"],
    queryFn: ({ pageParam = 1 }) => {
      return getTelemetryListData({ page_number: pageParam, page_size: LIMIT });
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
        page?.data?.map((telemetry, i) => {
          if (page.data.length === i + 1) {
            return (
              <Tr key={i} ref={ref}>
                <Td>{telemetry.id}</Td>
                <Td>{telemetry.device_code}</Td>
                <Td>
                  {telemetry.inflow.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (m³/hr)
                </Td>
                <Td>
                  {telemetry.outflow.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (L/Min)
                </Td>
                <Td>{telemetry.level / 10}</Td>
                <Td>
                  {telemetry.involume.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (mL)
                </Td>
                <Td>
                  {telemetry.outvolume.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (mL)
                </Td>
                <Td>{`${dayjs(telemetry.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  telemetry.created_at
                )}`}</Td>
              </Tr>
            );
          } else {
            return (
              <Tr key={i} ref={ref}>
                <Td>{telemetry.id}</Td>
                <Td>{telemetry.device_code}</Td>
                <Td>
                  {telemetry.inflow.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (m³/hr)
                </Td>
                <Td>
                  {telemetry.outflow.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (L/Min)
                </Td>
                <Td>{telemetry.level / 10}</Td>
                <Td>
                  {telemetry.involume.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (mL)
                </Td>
                <Td>
                  {telemetry.outvolume.map((x, y) => (
                    <span key={y}>
                      {y > 0 && ", "}
                      {x.toFixed(2)}
                    </span>
                  ))}{" "}
                  (mL)
                </Td>
                <Td>{`${dayjs(telemetry.created_at).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  telemetry.created_at
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
      {isFetchingNextPage && "fetching..."}
    </Box>
  );
};

export default TelemetryListTable;
