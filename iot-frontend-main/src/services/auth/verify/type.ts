import type { ApiResponse } from "@/interfaces/api";

export interface IRequestVerifyAccount {
  token: string;
}

export type TResponseVerifyAccount = Promise<ApiResponse<void>>;
