import callApi from "@/utils/api";

import type { IRequestLogin, TResponseLogin } from "./type";

export const login = async ({ emailOrPhone, password, type }: IRequestLogin): TResponseLogin =>
  await callApi({
    method: "POST",
    url: "/user/login",
    data: {
      email: emailOrPhone,
      password,
      type,
    },
  });
