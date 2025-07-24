import type { Response, ResponseMessage } from "@/interfaces/api";
import type { UpdatePasswordFormStateParams } from "@/interfaces/user";
import callApi from "@/utils/api";

import type { IRequestGetUserDetail, TResponseGetUserDetail } from "./type";

// TODO: refine
export const updatePassword = async ({
  new_password,
  old_password,
}: UpdatePasswordFormStateParams): Promise<Response<ResponseMessage>> =>
  callApi({
    method: "PATCH",
    url: "/user/password/update",
    data: {
      old_password,
      new_password,
    },
  });

// TODO: refine
export const forgotPassword = async ({ email }: { email: string }) =>
  callApi({
    method: "POST",
    url: "/user/password/update",
    data: {
      email,
    },
  });

// TODO: refine
export const resetPassword = async ({ token, new_password }: { token: string; new_password: string }) =>
  callApi({
    method: "POST",
    url: "/user/password/reset",
    data: {
      token,
      new_password,
    },
  });

// TODO: refine
export const approval = async ({ user_id, village_ids }: { user_id: number; village_ids: number[] }) =>
  callApi({
    method: "POST",
    url: "/user/approval",
    data: {
      user_id,
      village_ids,
    },
  });

export const getUserDetail = async ({ user_id }: IRequestGetUserDetail): TResponseGetUserDetail =>
  callApi({
    method: "GET",
    url: `/user/detail`,
    params: {
      user_id,
    },
  });
