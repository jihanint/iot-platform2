import { useEffect, useState } from "react";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getDeviceStatusLogListData, getWaterTelemetryLogListData } from ".";
import type { IGetDeviceTelemetryParams } from "./type";

interface IUseLogQuery extends IGetDeviceTelemetryParams {}
export const PAGE_SIZE_LIMIT = 100;
export default function useLogQuery({ ...props }: IUseLogQuery) {
  const [deviceCode, setDeviceCode] = useState("");
  const [pageParam, setPageParam] = useState(1);
  const queryClient = useQueryClient();
  const {
    data: statusLogData,
    isSuccess: isSuccessGetDeviceStatusLog,
    hasNextPage: isStatusLogDataHasNextPage,
    isFetchingNextPage: isFetchingGetDeviceStatusLog,
    fetchNextPage: fetchDeviceStatusLogNextPage,
  } = useInfiniteQuery({
    queryKey: ["GET_INFINITE_DEVICE_STATUS_LOG"],
    queryFn: ({ pageParam = 1 }) => {
      return getDeviceStatusLogListData({
        page_number: pageParam,
        page_size: String(PAGE_SIZE_LIMIT),
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage?.data?.length === PAGE_SIZE_LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: telemetryLogData,
    isSuccess: isSuccessGetWaterTelemetryLog,
    hasNextPage: isTelemetryLogDataHasNextPage,
    isFetchingNextPage: isFetchingGetWaterTelemetryLog,
    fetchNextPage: fetchWaterTelemetryLogNextPage,
    refetch: refetchWaterTelemetryLog,
  } = useInfiniteQuery({
    queryKey: ["GET_INFINITE_WATER_TELEMETRY_LOG"], // Set initial search value
    queryFn: ({ pageParam = 1 }) => {
      // console.log({ search });
      return getWaterTelemetryLogListData({
        page_number: pageParam,
        page_size: String(PAGE_SIZE_LIMIT),
        code: deviceCode,
        // order_by: props.order_by,
        // search: search,
        // sort_by: props.sort_by,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage?.data?.length === PAGE_SIZE_LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });

  const {
    data: telemetryLogData2,
    mutateAsync: mutateTelemetryLog,
    isLoading: isLoadingTelemetryLog,
  } = useMutation({
    mutationKey: ["WATER_TELEMETRY_LOG"],
    mutationFn: getWaterTelemetryLogListData,
  });

  // useEffect(() => {
  //   const fetch = async () => {
  //     await mutateTelemetryLog({
  //       page_number: pageParam.toString(),
  //       page_size: String(PAGE_SIZE_LIMIT),
  //       code: deviceCode,
  //     });
  //   };
  //   fetch();
  // }, []);

  useEffect(() => {
    const refetch = async () => {
      queryClient.invalidateQueries(["WATER_TELEMETRY_LOG"]);
      if (deviceCode !== "") {
        setPageParam(1);
        await mutateTelemetryLog({
          page_number: "1",
          page_size: String(PAGE_SIZE_LIMIT),
          code: deviceCode,
        });
      }
    };
    refetch();
  }, [deviceCode]);

  return {
    statusLogData,
    isSuccessGetDeviceStatusLog,
    isStatusLogDataHasNextPage,
    isFetchingGetDeviceStatusLog,
    fetchDeviceStatusLogNextPage,
    //
    telemetryLogData,
    isSuccessGetWaterTelemetryLog,
    isTelemetryLogDataHasNextPage,
    isFetchingGetWaterTelemetryLog,
    fetchWaterTelemetryLogNextPage,
    refetchWaterTelemetryLog,
    //
    deviceCode,
    setDeviceCode,
    pageParam,
    setPageParam,
    //
    telemetryLogData2,
    mutateTelemetryLog,
    isLoadingTelemetryLog,
  };
}
