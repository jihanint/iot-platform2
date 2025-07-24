import type { SetStateAction } from "react";
import React from "react";

import type { UseMutateAsyncFunction } from "@tanstack/react-query";

import { ContentContainer } from "@/common/layouts";
import type { IResponseListApi } from "@/interfaces/common/list";
import type { GetStatusLogResponse } from "@/interfaces/device";
import type { IDeviceDataItem } from "@/services/device/type";
import type { IRequestGetDeviceTelemetryLogList, IWaterTelemetryLogItem } from "@/services/log/type";

import DeviceLogHeader from "./Header";
import type { IModuleDevicesLogStatusProps } from "./Status";
import ModuleDevicesLogStatus from "./Status";
import type { IModuleDevicesLogTelemetryProps } from "./Telemetry";
import ModuleDevicesLogTelemetry from "./Telemetry";
import useFilterValue from "./useFilterValue";

interface IModuleDeviceLogProps extends IModuleDevicesLogStatusProps, IModuleDevicesLogTelemetryProps {
  deviceList?: IDeviceDataItem[];
  onRefetchDeviceList?: () => void;
  onRefetchWaterTelemetryLog?: (device_code: string) => void;
  setDeviceCode: React.Dispatch<React.SetStateAction<string>>;
  deviceCode: string;
  pageParam: number;
  setPageParam: React.Dispatch<SetStateAction<number>>;
  mutateTelemetryLog: UseMutateAsyncFunction<
    IResponseListApi<IWaterTelemetryLogItem>,
    unknown,
    IRequestGetDeviceTelemetryLogList,
    unknown
  >;
  mutateStatusLog: UseMutateAsyncFunction<
    GetStatusLogResponse,
    unknown,
    {
      code?: string | undefined;
      page_number?: string | number | undefined;
      page_size: string | number;
    },
    unknown
  >;
  isLoadingTelemetryLog: boolean;
}

const ModuleDeviceLog = ({ ...props }: IModuleDeviceLogProps) => {
  const { activeTab, transformedDeviceList, control } = useFilterValue({
    deviceList: props.deviceList,
    refetchTelemetryLog: props.refetchWaterTelemetryLog,
    setDeviceCode: props.setDeviceCode,
    deviceCode: props.deviceCode,
    setPageParam: props.setPageParam,
  });

  return (
    <ContentContainer position="relative">
      <DeviceLogHeader
        activeTab={activeTab}
        control={control}
        deviceList={transformedDeviceList}
        pageParam={props.pageParam}
        setPageParam={props.setPageParam}
        mutateTelemetryLog={props.mutateTelemetryLog}
        mutateStatusLog={props.mutateStatusLog}
        deviceCode={props.deviceCode}
      />
      {activeTab === "STATUS_LOG" && (
        <ModuleDevicesLogStatus
          deviceLogStatusData={props.deviceLogStatusData}
          isFetchingGetDeviceStatusLog={props.isFetchingGetDeviceStatusLog}
          isStatusLogDataHasNextPage={props.isStatusLogDataHasNextPage}
          isSuccessGetDeviceStatusLog={props.isSuccessGetDeviceStatusLog}
          fetchDeviceStatusLogNextPage={props.fetchDeviceStatusLogNextPage}
        />
      )}
      {activeTab === "TELEMETRY_LOG" && !props.isLoadingTelemetryLog && (
        <ModuleDevicesLogTelemetry
          deviceLogTelemetryData={props.deviceLogTelemetryData}
          isFetchingGetWaterTelemetryLog={props.isFetchingGetWaterTelemetryLog}
          isWaterTelemetryLogDataHasNextPage={props.isWaterTelemetryLogDataHasNextPage}
          isSuccessGetWaterTelemetryLog={props.isSuccessGetWaterTelemetryLog}
          fetchWaterTelemetryLogNextPage={props.fetchWaterTelemetryLogNextPage}
          refetchWaterTelemetryLog={props.refetchWaterTelemetryLog}
        />
      )}
    </ContentContainer>
  );
};

export default ModuleDeviceLog;
