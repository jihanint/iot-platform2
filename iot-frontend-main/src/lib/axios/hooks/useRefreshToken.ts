import { signIn, useSession } from "next-auth/react";

import axios from "../axios";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post(
      "/auth/refresh-token/",
      {
        refreshToken: session?.user.token,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (session) session.user.token = res.data.token;
    else signIn();
  };
  return refreshToken;
};
