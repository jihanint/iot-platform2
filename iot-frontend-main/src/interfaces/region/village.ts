export interface IGetVillageParams {
  district_id?: string;
  is_assigned_for?: boolean;
  is_device_installed?: boolean;
  search?: string;
}

export interface IGetVillageDetailParams {
  village_id: string;
}

export interface IGetVillageDetailResponse {
  message: string;
  data: GetVillageData;
  meta: any;
}

export interface GetVillageData {
  id: number;
  village_name: string;
  village_profile: VillageProfile;
  device_profile: DeviceProfile;
}

export interface VillageProfile {
  field_id: string;
  lat: number;
  long: number;
  population: number;
  install_date: string;
  pic_name: string;
  pic_phone: string;
}

export interface DeviceProfile {
  device_id: number;
  device_code: string;
  brand: string;
  capacity: number;
  power: number;
  level: number;
  type: string;
  install_date: string;
}
