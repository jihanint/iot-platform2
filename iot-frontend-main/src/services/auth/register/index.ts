import callApi from "@/utils/api";

import type { IRequestRegister, TResponseRegister } from "./type";

export const register = async (payload: IRequestRegister): TResponseRegister =>
  await callApi({
    method: "POST",
    url: "/user/signup",
    data: {
      email: payload.emailOrPhone,
      debug: true,
      ...payload,
    },
  });
