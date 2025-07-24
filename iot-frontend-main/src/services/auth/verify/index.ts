import callApi from "@/utils/api";

import type { IRequestVerifyAccount, TResponseVerifyAccount } from "./type";

export const verify = async (payload: IRequestVerifyAccount): TResponseVerifyAccount =>
  await callApi({
    method: "POST",
    url: "/user/verify",
    data: {
      token: payload.token,
    },
  });
