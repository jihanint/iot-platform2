import type { IResponseListApi } from "@/interfaces/common/list";

// TODO: separate to global interface
interface IGetPaginationParams {
  page_number: string;
  page_size: string;
}
export interface IGetDeviceStatusLogParams extends IGetPaginationParams {}

export interface IGetDeviceTelemetryParams {
  search?: string;
  sort_by?: "village_name" | "city" | "calibration_date";
  order_by?: "asc" | "dsc";
  code?: string;
}
export interface IRequestGetDeviceTelemetryLogList extends IGetPaginationParams, IGetDeviceTelemetryParams {}

export interface IGetDeviceStatusLogResponse {
  id: number;
  device_code: string;
  rssi: number;
  battery_current: number;
  battery_level: number;
  battery_power: number;
  lat: number;
  long: number;
  created_at: string;
}

export interface IWaterTelemetryLogItem {
  id: number;
  device_code: string;
  inflow: number[];
  outflow: number[];
  level: number;
  involume: number[];
  outvolume: number[];
  created_at: string;
}

export type TResponseGetWaterTelemetryLog = Promise<IResponseListApi<IWaterTelemetryLogItem>>;
export type TResponseGetStatusLog = Promise<IResponseListApi<IGetDeviceStatusLogResponse>>;

export interface IDeviceCalibrationListItem {
  device_id: number;
  village_id: number;
  village_name: string;
  city: string;
  water_level_calibration_status: number;
  water_flow_calibration_status: number;
  calibration_date: string;
}
