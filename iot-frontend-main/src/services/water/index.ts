import type { Response } from "@/interfaces/api";
import type {
  GetTelemetryListDataParams,
  GetTelemetryListResponse,
  GetWaterChartParams,
  GetWaterDataListResponse,
  GetWaterListDataParams,
  WaterChartResponse,
} from "@/interfaces/water";
import callApi from "@/utils/api";

export const getWaterUsageData = async ({
  interval,
  area,
  is_must_village,
  previous,
}: GetWaterChartParams): Promise<Response<WaterChartResponse>> =>
  callApi({
    method: "GET",
    url: "/water/usage-chart",
    params: {
      interval,
      area,
      is_must_village,
      previous,
    },
  });

export const getWaterProductionData = async ({
  interval,
  area,
  is_must_village,
  previous,
  start_time,
  end_time,
  frequency,
}: GetWaterChartParams): Promise<Response<WaterChartResponse>> =>
  callApi({
    method: "GET",
    url: "/water/production-chart",
    params: {
      interval,
      area,
      is_must_village,
      previous,
      start_time,
      end_time,
      frequency,
    },
  });

export const getWaterVolumeData = async ({
  interval,
  area,
  is_must_village,
  previous,
  start_time,
  end_time,
  frequency,
}: GetWaterChartParams): Promise<Response<WaterChartResponse>> =>
  callApi({
    method: "GET",
    url: "/water/level-chart",
    params: {
      interval,
      area,
      is_must_village,
      previous,
      start_time,
      end_time,
      frequency,
    },
  });

export const getTelemetryListData = async ({
  code,
  page_number,
  page_size,
}: GetTelemetryListDataParams): Promise<GetTelemetryListResponse> =>
  callApi({
    method: "GET",
    url: "/water/telemetry-list",
    params: {
      code,
      page_number,
      page_size,
    },
  });

export const getWaterListData = async ({
  village_id,
  water_type,
  page_number,
  page_size,
}: GetWaterListDataParams): Promise<GetWaterDataListResponse> =>
  await callApi({
    method: "GET",
    url: "/water/list",
    params: {
      village_id,
      water_type,
      page_number,
      page_size,
      interval: "month",
    },
  });
