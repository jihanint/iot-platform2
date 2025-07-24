import { useInfiniteQuery } from "@tanstack/react-query";

import { getWaterTelemetryLogListData } from ".";

const PAGE_SIZE_LIMIT = 10; // Adjust the page size as needed

// const {
//   data: telemetryLogData,
//   isSuccess: isSuccessGetWaterTelemetryLog,
//   hasNextPage: isTelemetryLogDataHasNextPage,
//   isFetchingNextPage: isFetchingGetWaterTelemetryLog,
//   fetchNextPage: fetchWaterTelemetryLogNextPage,
//   refetch: refetchWaterTelemetryLog,
// } = useInfiniteQuery({
//   queryKey: ["GET_INFINITE_WATER_TELEMETRY_LOG"], // Set initial search value
//   queryFn: ({ pageParam = 1}) => {

//     // console.log({ search });
//     return getWaterTelemetryLogListData({
//       page_number: pageParam,
//       // page_size: String(PAGE_SIZE_LIMIT),
//       // order_by: props.order_by,
//       search: search,
//       // sort_by: props.sort_by,
//     });
//   },
//   getNextPageParam: (lastPage, allPages) => {
//     const nextPage = lastPage?.data?.length === PAGE_SIZE_LIMIT ? allPages.length + 1 : undefined;
//     return nextPage;
//   },
//   refetchOnWindowFocus: false,
// });

export const useWaterTelemetryLogData = (search = "") => {
  const { data } = useInfiniteQuery(
    ["GET_INFINITE_WATER_TELEMETRY_LOG", search], // Key includes search param
    ({ pageParam = 1 }) => {
      return getWaterTelemetryLogListData({
        page_number: pageParam.toString(),
        page_size: String(PAGE_SIZE_LIMIT),
        search, // Include search param in request
        // order_by: props.order_by, // Uncomment if needed
        // sort_by: props.sort_by, // Uncomment if needed
      });
    },
    {
      getNextPageParam: (lastPage: any, allPages: any) => {
        const nextPage = lastPage?.data?.length === PAGE_SIZE_LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
      refetchOnWindowFocus: false,
      // Add refetch options:
      // refetchInterval: 5000, // Refetch every 5 seconds (optional)
      refetchOnMount: false, // Don't refetch on component mount
      // manual: true, // Enable manual refetch using fetchNextPage
    }
  );

  return {
    data,
  };
};
