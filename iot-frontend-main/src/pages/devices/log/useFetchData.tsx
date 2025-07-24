import useDeviceQuery from "@/services/device/useDeviceQuery";
import useLogQuery from "@/services/log/useLogQuery";

export default function useFetchData() {
  const { deviceList, refetchDeviceList } = useDeviceQuery({
    isEnabled: true,
  });

  const {
    statusLogData,
    isFetchingGetDeviceStatusLog,
    isStatusLogDataHasNextPage,
    isSuccessGetDeviceStatusLog,
    fetchDeviceStatusLogNextPage,
  } = useLogQuery({});

  const {
    telemetryLogData,
    isFetchingGetWaterTelemetryLog,
    isTelemetryLogDataHasNextPage,
    isSuccessGetWaterTelemetryLog,
    fetchWaterTelemetryLogNextPage,
    refetchWaterTelemetryLog,
    pageParam,
    setPageParam,
    telemetryLogData2,
    mutateTelemetryLog,
    isLoadingTelemetryLog,
  } = useLogQuery({});

  const { setDeviceCode, deviceCode } = useLogQuery({});

  const getQueryKey = (pageParam: number, search: string) => {
    return ["GET_INFINITE_WATER_TELEMETRY_LOG", { pageParam, search }];
  };

  const handleRefetchWaterTelemetryLog = (device_code: string) => {
    refetchWaterTelemetryLog({
      queryKey: getQueryKey(1, "SC17"),
    });
  };

  return {
    statusLogData,
    isFetchingGetDeviceStatusLog,
    isStatusLogDataHasNextPage,
    isSuccessGetDeviceStatusLog,
    fetchDeviceStatusLogNextPage,
    //
    telemetryLogData,
    isFetchingGetWaterTelemetryLog,
    isTelemetryLogDataHasNextPage,
    isSuccessGetWaterTelemetryLog,
    fetchWaterTelemetryLogNextPage,
    refetchWaterTelemetryLog,
    handleRefetchWaterTelemetryLog,
    //
    deviceList,
    refetchDeviceList,
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
