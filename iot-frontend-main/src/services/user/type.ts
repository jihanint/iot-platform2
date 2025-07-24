import type { ApiResponse } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";

export declare type TUserRole = "MANAGER" | "SUPERVISOR";

export interface IUserDetailItem {
  user_id: number;
  user_name: string;
  email?: string;
  phone_number: string;
  role: TUserRole;
  villages: IRegionDataItem[];
}

export interface IRequestGetUserDetail {
  user_id: number | string;
}

export type TResponseGetUserDetail = Promise<ApiResponse<IUserDetailItem>>;
