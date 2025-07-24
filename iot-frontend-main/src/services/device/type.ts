export interface IRequestGetDeviceList {
  search?: string;
  status?: number;
  sort_by?: "installation_date";
  order_by?: "asc" | "desc";
}

export interface IDeviceDataItem {
  device_id: number;
  device_code: string;
  village_id: number;
  village_name: string;
  city: string;
  installation_date: string;
  last_update: string;
  status: number;
}
