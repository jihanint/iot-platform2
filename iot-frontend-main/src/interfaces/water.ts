import type { IChartFrequent, IChartPeriod } from "./layout";

export interface GetWaterChartParams {
  interval?: IChartPeriod;
  area?: number | "all";
  is_must_village?: boolean;
  previous?: number;
  frequency?: IChartFrequent;
  start_time?: string;
  end_time?: string;
}

export interface GetTelemetryListDataParams {
  code?: string;
  page_number?: number | string;
  page_size?: number | string;
}

export interface WaterChartResponse {
  series: Series[];
  date: string[];
}

export interface Series {
  name: string;
  data: number[];
}

export interface GetTelemetryListResponse {
  message: string;
  data: TelemetryData[];
  meta: Meta;
}

export interface TelemetryData {
  id: number;
  device_code: string;
  inflow: number[];
  outflow: number[];
  level: number;
  involume: number[];
  outvolume: number[];
  created_at: string;
}

export interface Meta {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export interface GetWaterListDataParams {
  village_id: number | string;
  water_type: "production" | "usage" | "level";
  page_number?: number | string;
  page_size?: number | string;
}

export interface GetWaterDataListResponse {
  message: string;
  data: WaterData[];
  meta: Meta;
}

export interface WaterData {
  id: number;
  created_at: string;
  value: number;
  status: number;
}

export interface WaterListResponse {}
