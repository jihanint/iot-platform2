import type { ApiResponse } from "@/interfaces/api";
import type { IFormDataRegister } from "@/modules/auth/Register/Form/useFormValue";

export type IRequestRegister = Omit<IFormDataRegister, "confirmPassword" | "debug">;

export type TResponseRegister = Promise<ApiResponse<{ email: string; fullname: string }>>;
