import type { ResponseMessage } from "@/interfaces/api";
import type {
  CalibratingDeviceParams,
  CreateDeviceParams,
  DetailDeviceResponse,
  DeviceInstallFormStateParams,
  DeviceLogStatusParams,
  GetDetailCalibratedDeviceResponse,
  GetDeviceFunctionalityResponse,
  GetDeviceParams,
  GetStatusLogResponse,
} from "@/interfaces/device";
import callApi from "@/utils/api";

export const deviceInstall = async ({
  capacity,
  code,
  iot_install_date,
  lat,
  long,
  pump_install_date,
  village_id,
}: DeviceInstallFormStateParams): Promise<ResponseMessage> =>
  callApi({
    method: "POST",
    url: "/device/install",
    data: {
      capacity,
      code,
      iot_install_date,
      lat,
      long,
      pump_install_date,
      village_id,
    },
  });

export const logStatus = async ({
  battery_current,
  battery_level,
  battery_power,
  device_code,
  lat,
  long,
  rssi,
  timestamp,
}: DeviceLogStatusParams): Promise<ResponseMessage> =>
  callApi({
    method: "POST",
    url: "/device/log-status",
    data: {
      battery_current,
      battery_level,
      battery_power,
      device_code,
      lat,
      long,
      rssi,
      timestamp,
    },
  });

export const getDeviceList = async ({ order_by, search, sort_by, status }: GetDeviceParams) =>
  callApi({
    method: "GET",
    url: "/device/list",
    params: {
      order_by,
      search,
      sort_by,
      status,
    },
  });

export const getCalibrateDeviceList = async ({ order_by, search, sort_by }: GetDeviceParams) =>
  callApi({
    method: "GET",
    url: "/device/calibration-list",
    params: {
      order_by,
      search,
      sort_by,
      status,
    },
  });

export const getDeviceStatusLog = async ({
  code,
  page_number,
  page_size,
}: {
  code?: string;
  page_number?: string | number;
  page_size: string | number;
}): Promise<GetStatusLogResponse> =>
  callApi({
    method: "GET",
    url: "/device/status-logs",
    params: {
      code,
      page_number,
      page_size,
    },
  });

export const getDeviceFunctionalityStats = async ({
  area,
}: {
  area?: string;
}): Promise<GetDeviceFunctionalityResponse> =>
  callApi({
    method: "GET",
    url: "/device/functionality-stats",
    params: {
      area,
    },
  });

export const saveDevice = async ({
  device_id,
  brand,
  capacity,
  device_code,
  district_id,
  field_code,
  iot_install_date,
  lat,
  level,
  long,
  pic_contact,
  pic_name,
  population,
  power,
  pump_install_date,
  type,
  village_name,
  location,
}: CreateDeviceParams): Promise<ResponseMessage> =>
  callApi({
    method: "POST",
    url: "/device/save",
    data: {
      device_id,
      brand,
      capacity,
      device_code,
      district_id,
      field_code,
      iot_install_date,
      lat,
      level,
      long,
      pic_contact,
      pic_name,
      population,
      power,
      pump_install_date,
      type,
      village_name,
      location,
    },
  });

export const getDetailDevice = async ({ device_id }: { device_id: number }): Promise<DetailDeviceResponse> =>
  callApi({
    method: "GET",
    url: `/device/saved?device_id=${device_id}`,
  });

export const calibratingDevice = async (params: CalibratingDeviceParams): Promise<ResponseMessage> =>
  callApi({
    method: "POST",
    url: "/device/calibrate",
    data: params,
  });

export const getCalibratedDevice = async ({
  device_id,
}: {
  device_id: number;
}): Promise<GetDetailCalibratedDeviceResponse> =>
  callApi({
    method: "GET",
    url: "/device/calibrated",
    params: { device_id },
  });
