import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

// import DataTable from "react-data-table-component";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// import { waterHistoryListResponse } from "@/mocks/data/water-history-lists";
import { useInfiniteQuery } from "@tanstack/react-query";

import { StatusBadge } from "@/common/components";
import { dayjs } from "@/lib/dayjs";
import { getWaterListData } from "@/services/water";
import { getIndonesianTimeDivision } from "@/utils/helper";

interface WaterHistoryListTable {
  type: "production" | "usage" | "level";
}

const WaterHistoryListTable = ({ type = "production" }: WaterHistoryListTable) => {
  const LIMIT = 10;
  const { ref, inView } = useInView();
  const { query } = useRouter();

  const columnValueTitle = useMemo(() => {
    switch (type) {
      case "production":
        return "Produksi Air (m3)";
      case "usage":
        return "Penggunaan Air (m3)";
      case "level":
        return "Tingkat Air (m)";
      default:
        return "";
    }
  }, []);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [`get_water_history_${type}`],
    queryFn: ({ pageParam = 1 }) =>
      getWaterListData({
        page_number: pageParam,
        page_size: LIMIT,
        water_type: type,
        village_id: query.villageId as string,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.data ? (lastPage?.data?.length === LIMIT ? allPages.length + 1 : undefined) : undefined;
      return nextPage;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(query.villageId && type),
  });

  // const { columns } = useWaterTableOptions({ columnValueTitle });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data?.pages?.map(
      page =>
        page?.data?.map((result, i) => {
          if (page.data.length === i + 1) {
            return (
              <Tr key={i} ref={ref}>
                <Td>{`${dayjs(result.created_at).format("HH:mm")} ${getIndonesianTimeDivision(result.created_at)}`}</Td>
                <Td>{`${dayjs(result.created_at).format("DD/MM/YY")}`}</Td>
                <Td>{result.value.toFixed(3)} </Td>
                <Td>
                  <Box w="40%">
                    <StatusBadge badgeStatus={result.status} width="max-content" />
                  </Box>
                </Td>
              </Tr>
            );
          } else {
            return (
              <Tr key={i}>
                <Td>{`${dayjs(result.created_at).format("HH:mm")} ${getIndonesianTimeDivision(result.created_at)}`}</Td>
                <Td>{`${dayjs(result.created_at).format("DD/MM/YY")}`}</Td>
                <Td>{result.value.toFixed(3)}</Td>
                <Td>
                  <Box w="40%">
                    <StatusBadge badgeStatus={result.status} width="max-content" />
                  </Box>
                </Td>
              </Tr>
            );
          }
        })
    );

  /**
   * Table Sub Header (Filter Area)
   */

  return (
    <Box>
      {/* <TableContainer> */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Jam</Th>
            <Th>Tanggal</Th>
            <Th>{columnValueTitle}</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>{content}</Tbody>
      </Table>
      {isFetchingNextPage && "fetching..."}
    </Box>
    // <DataTable
    //   columns={columns}
    //   data={data?.pages.}
    //   keyField="id"
    //   responsive
    //   striped
    //   highlightOnHover
    //   pointerOnHover
    // />
  );
};

export default dynamic(() => Promise.resolve(WaterHistoryListTable), {
  ssr: false,
});
