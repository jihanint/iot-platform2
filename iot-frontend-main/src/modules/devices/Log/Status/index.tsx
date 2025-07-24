import React from "react";

import type { IDevicesLogStatusTableProps } from "./Table";
import DeviceLogStatusTable from "./Table";

export interface IModuleDevicesLogStatusProps extends Omit<IDevicesLogStatusTableProps, "tableData"> {}

const ModuleDevicesLogStatus = ({ ...props }: IModuleDevicesLogStatusProps) => {
  return (
    <div>
      <DeviceLogStatusTable
        deviceLogStatusData={props.deviceLogStatusData}
        fetchDeviceStatusLogNextPage={props.fetchDeviceStatusLogNextPage}
        isFetchingGetDeviceStatusLog={props.isFetchingGetDeviceStatusLog}
        isStatusLogDataHasNextPage={props.isStatusLogDataHasNextPage}
        isSuccessGetDeviceStatusLog={props.isSuccessGetDeviceStatusLog}
      />
    </div>
  );
};

export default ModuleDevicesLogStatus;
