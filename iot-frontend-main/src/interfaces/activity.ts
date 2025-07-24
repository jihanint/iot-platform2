export interface ActivityHistoryResponse {
  difference: number;
  data: ActivityHistoryData[];
  meta: Meta;
}

export interface ActivityHistoryData {
  id: number;
  message: string;
  type: AlertType;
  created_at: string;
}

export interface Meta {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export declare type AlertType = "alert" | "device";

export interface GroupedActivityHistoreResponse {
  data: {
    date: string;
    activities: ActivityHistoryData[];
  }[];
  meta: Meta;
  message: string;
}

// export interface ActivityData {
//   id: number;
//   message: string;
//   type: string;
//   created_at: string;
// }
