import type { ApiResponse } from "@/interfaces/api";
import type { UserItem } from "@/interfaces/user";

declare type IdentifierType = "email" | "phone";

export interface IRequestLogin {
  emailOrPhone: string;
  password: string;
  type?: IdentifierType;
}

export type TResponseLogin = Promise<ApiResponse<UserItem>>;
