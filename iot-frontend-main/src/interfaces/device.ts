export interface DeviceData {
  village_id: number;
  village_name: string;
  city: string;
  installation_date: string;
  last_update: string;
  status: number;
  device_id: number;
}

export interface GetDeviceParams {
  search?: string;
  status?: number;
  sort_by?: "installation_date";
  order_by?: "asc" | "desc";
}

export interface DeviceInstallFormStateParams {
  village_id: number;
  code: string;
  capacity: number;
  lat: number;
  long: number;
  pump_install_date: string;
  iot_install_date: string;
}

export interface DeviceLogStatusParams {
  device_code: string;
  rssi: number;
  battery_current: number;
  battery_level: number;
  battery_power: number;
  lat: number;
  long: number;
  timestamp: number;
}

export interface GetStatusLogResponse {
  message: string;
  data: StatusResponseData[];
  meta: Meta;
}

export interface StatusResponseData {
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

export interface Meta {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export interface GetDeviceFunctionalityResponse {
  message: string;
  data: FunctionalityData;
  meta: Meta;
}

export interface FunctionalityData {
  functioning: Functioning;
  non_functioning: NonFunctioning;
  permanent_non_functioning: PermanentNonFunctioning;
}

export interface Functioning {
  total: number;
  difference: number;
}

export interface NonFunctioning {
  total: number;
  difference: number;
}

export interface PermanentNonFunctioning {
  total: number;
  difference: number;
}

export interface CreateDeviceParams {
  device_id: number;
  village_name?: string;
  district_id?: number;
  field_code?: string;
  lat?: number;
  long?: number;
  population?: number;
  pump_install_date?: string;
  pic_name?: string;
  pic_contact?: string;
  device_code?: string;
  brand?: string;
  capacity?: number;
  power?: number;
  level?: number;
  type?: string;
  iot_install_date?: string;
  location?: string;
}

export interface DetailDeviceResponse {
  message: string;
  data: DetailDevice;
  meta: Meta;
}

export interface DetailDevice {
  device_id: number;
  village_data: VillageData;
  device_data: DeviceData;
}

export interface VillageData {
  village_name: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  district_id: number;
  district_name: string;
  field_code: string;
  lat: number;
  long: number;
  population: number;
  pump_install_date: string;
  pic_name: string;
  pic_contact: string;
}

export interface DeviceData {
  device_code: string;
  brand: string;
  capacity: number;
  power: number;
  level: number;
  type: string;
  iot_install_date: string;
}

export interface CalibrateDeviceData {
  device_id: number;
  village_id: number;
  village_name: string;
  city: string;
  water_level_calibration_status: number;
  water_flow_calibration_status: number;
  calibration_date: string;
}

export interface GetCalibrateDeviceParams {
  search?: string;
  sort_by?: "installation_date";
  order_by?: "asc" | "desc";
}

export interface CalibratingDeviceParams {
  device_id: number;
  shape: "BLOCK" | "TUBE";
  width: number;
  length: number;
  diameter: number;
  level: Level;
  inflow: CalibratingDeviceTest[];
  outflow: CalibratingDeviceTest[];
}

export interface FlowDeviceTest {
  base: number;
  test: CalibratingDeviceTest[];
}

export interface CalibratingDeviceTest {
  first_test?: CalibratingDeviceTestLevel;
  second_test?: CalibratingDeviceTestLevel;
  third_test?: CalibratingDeviceTestLevel;
}

export interface CalibratingDeviceTestLevel {
  actual_level?: number;
  telemetry_level?: number;
}

export interface GetDetailCalibratedDeviceResponse {
  message: string;
  data: DetailCalibratedDevice;
  meta: Meta;
}

export interface DetailCalibratedDevice {
  device_id: number;
  shape: "BLOCK" | "TUBE";
  width: number;
  length: number;
  diameter: number;
  level: Level;
  inflow: CalibratingDeviceTest[];
  outflow: CalibratingDeviceTest[];
}

export interface WaterLevel {
  height: number;
  diameter: number;
}

export interface Level {
  actual_level: number;
  telemetry_level: number;
}

export interface WaterFlow {
  first_test: number;
  second_test: number;
  third_test: number;
}
