import { useEffect } from "react";

import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";

import { useLayoutState } from "@/common/hooks";
import { DashboardLayout } from "@/common/layouts";
import { getDeviceStatusLog } from "@/services/device";
import { getWaterTelemetryLogListData } from "@/services/log";
import { PAGE_SIZE_LIMIT } from "@/services/log/useLogQuery";

import useFetchData from "./useFetchData";

const ModuleDeviceLog = dynamic(async () => await import("@/modules/devices/Log/pages"));

const PageDevicesLog = () => {
  const { setBreadCrumb } = useLayoutState();
  const {
    // statusLogData,
    isSuccessGetDeviceStatusLog,
    isStatusLogDataHasNextPage,
    isFetchingGetDeviceStatusLog,
    fetchDeviceStatusLogNextPage,
    //
    // telemetryLogData,
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
    setDeviceCode,
    deviceCode,
    pageParam,
    setPageParam,
    //
    // telemetryLogData2,
    // isLoadingTelemetryLog,
    // mutateTelemetryLog,
  } = useFetchData();

  useEffect(() => {
    setBreadCrumb("Log Perangkat");
  }, []);

  const handleRefetchDeviceList = () => {
    refetchDeviceList();
  };

  const {
    data: telemetryLogData2,
    mutateAsync: mutateTelemetryLog,
    isLoading: isLoadingTelemetryLog,
  } = useMutation({
    mutationKey: ["WATER_TELEMETRY_LOG"],
    mutationFn: getWaterTelemetryLogListData,
  });

  const {
    data: statusLogData,
    mutateAsync: mutateStatusLog,
    isLoading: isLoadingStatusLog,
  } = useMutation({
    mutationKey: ["WATER_TELEMETRY_LOG"],
    mutationFn: getDeviceStatusLog,
  });

  useEffect(() => {
    const fetch = async () => {
      await mutateTelemetryLog({
        page_number: pageParam.toString(),
        page_size: String(PAGE_SIZE_LIMIT),
        code: deviceCode,
      });
      await mutateStatusLog({
        page_number: pageParam.toString(),
        page_size: String(PAGE_SIZE_LIMIT),
        code: deviceCode,
      });
    };
    fetch();
  }, []);

  useEffect(() => {
    const refetch = async () => {
      if (deviceCode !== "") {
        setPageParam(1);
        await mutateTelemetryLog({
          page_number: "1",
          page_size: String(PAGE_SIZE_LIMIT),
          code: deviceCode,
        });
        await mutateStatusLog({
          page_number: "1",
          page_size: String(PAGE_SIZE_LIMIT),
          code: deviceCode,
        });
      }
    };
    refetch();
  }, [deviceCode]);

  return (
    <DashboardLayout>
      <ModuleDeviceLog
        deviceLogStatusData={statusLogData}
        isFetchingGetDeviceStatusLog={isFetchingGetDeviceStatusLog}
        isStatusLogDataHasNextPage={isSuccessGetDeviceStatusLog}
        isSuccessGetDeviceStatusLog={isStatusLogDataHasNextPage}
        fetchDeviceStatusLogNextPage={fetchDeviceStatusLogNextPage}
        //
        deviceLogTelemetryData={telemetryLogData2}
        isFetchingGetWaterTelemetryLog={isFetchingGetWaterTelemetryLog}
        isWaterTelemetryLogDataHasNextPage={isTelemetryLogDataHasNextPage}
        isSuccessGetWaterTelemetryLog={isSuccessGetWaterTelemetryLog}
        fetchWaterTelemetryLogNextPage={fetchWaterTelemetryLogNextPage}
        refetchWaterTelemetryLog={refetchWaterTelemetryLog}
        //
        deviceList={deviceList}
        onRefetchDeviceList={handleRefetchDeviceList}
        onRefetchWaterTelemetryLog={handleRefetchWaterTelemetryLog}
        //
        setDeviceCode={setDeviceCode}
        deviceCode={deviceCode}
        setPageParam={setPageParam}
        pageParam={pageParam}
        //
        isLoadingTelemetryLog={isLoadingTelemetryLog}
        mutateTelemetryLog={mutateTelemetryLog}
        mutateStatusLog={mutateStatusLog}
      />
    </DashboardLayout>
  );
};

export default PageDevicesLog;
