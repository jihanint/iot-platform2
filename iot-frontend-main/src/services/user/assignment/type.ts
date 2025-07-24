import type { ApiResponse } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";

import type { TUserRole } from "../type";

export declare type AssignmentActiveTab = "ASSIGNED" | "NOT_ASSIGNED";

// Assignment
export interface IUserAssignmentItem {
  user_id: number;
  user_name: string;
  phone_number: string;
  role: TUserRole;
  villages: IRegionDataItem[];
  email: string;
}
export type TResponseUserAssignedList = Promise<ApiResponse<IUserAssignmentItem[]>>;

export interface IRequestUserAssignment extends Omit<IUserAssignmentItem, "villages" | "email"> {
  village_ids: number[];
}
export interface IRequestDeleteUserAssignment extends Partial<IUserAssignmentItem> {}

export interface IRequestUserManagerAssignment {
  email: string;
  fullname: string;
  password: string;
  village_ids: number[];
}

// Unassignment
export interface IUserUnassignedItem extends IUserAssignmentItem {}

export type IResponseUserUnassignmentList = Promise<ApiResponse<IUserUnassignedItem[]>>;

export interface IUserUnassignment {
  message: string;
}
