import callApi from "@/utils/api";

import type {
  IGetDeviceStatusLogParams,
  IRequestGetDeviceTelemetryLogList,
  TResponseGetStatusLog,
  TResponseGetWaterTelemetryLog,
} from "./type";

export const getDeviceStatusLogListData = async ({
  page_number,
  page_size,
}: IGetDeviceStatusLogParams): TResponseGetStatusLog =>
  callApi({
    method: "GET",
    url: "/device/status-logs",
    params: {
      page_number,
      page_size,
    },
  });

export const getWaterTelemetryLogListData = async ({
  page_number,
  page_size,
  order_by,
  search,
  sort_by,
  code,
}: IRequestGetDeviceTelemetryLogList): TResponseGetWaterTelemetryLog =>
  callApi({
    method: "GET",
    url: "/water/telemetry-list",
    params: {
      page_number,
      page_size,
      order_by,
      search,
      sort_by,
      code,
    },
  });
