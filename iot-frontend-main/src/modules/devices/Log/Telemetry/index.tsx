import type { IDeviceLogTelemetryTableProps } from "./Table";
import DeviceLogTelemetryTable from "./Table";

export interface IModuleDevicesLogTelemetryProps extends Omit<IDeviceLogTelemetryTableProps, "tableData"> {}

const ModuleDevicesLogTelemetry = ({ ...props }: IModuleDevicesLogTelemetryProps) => {
  return (
    <div>
      <DeviceLogTelemetryTable
        deviceLogTelemetryData={props.deviceLogTelemetryData}
        isFetchingGetWaterTelemetryLog={props.isFetchingGetWaterTelemetryLog}
        isSuccessGetWaterTelemetryLog={props.isSuccessGetWaterTelemetryLog}
        isWaterTelemetryLogDataHasNextPage={props.isWaterTelemetryLogDataHasNextPage}
        fetchWaterTelemetryLogNextPage={props.fetchWaterTelemetryLogNextPage}
        refetchWaterTelemetryLog={props.refetchWaterTelemetryLog}
      />
    </div>
  );
};

export default ModuleDevicesLogTelemetry;
