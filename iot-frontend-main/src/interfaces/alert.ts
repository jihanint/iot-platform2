export interface AlertListResponse {
  message: string;
  data: AlertData[];
  meta: Meta;
}

export interface AlertData {
  id: number;
  village_name: string;
  city_name: string;
  alert_type: string;
  message: string;
  comment: string;
  created_at: string;
  action: string;
}

export interface Meta {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}
