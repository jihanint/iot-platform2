import { getSession, signOut } from "next-auth/react";

import type { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";

import axios from "@/lib/axios/axios";

import { handleApiError } from "./handler";

export default async function fetcher({ url, data, method, headers, ...config }: AxiosRequestConfig) {
  const authData = await getSession()
    .then(response => response)
    .catch((error: any) => {
      handleApiError(error);
    });

  const accessToken = authData?.user.token;

  try {
    const res: AxiosResponse = await axios({
      url,
      data,
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...(accessToken && { Authorization: `Bearer ${accessToken ?? ""}` }),
        ...(headers as RawAxiosRequestHeaders),
      },
      ...config,
    });
    const response = res.data;
    return response;
  } catch (error: any) {
    console.log(error);
    if (error.response.status === 401 && error.response.data.message.includes("expired")) {
      signOut();
    }
    throw error;
  }
}
