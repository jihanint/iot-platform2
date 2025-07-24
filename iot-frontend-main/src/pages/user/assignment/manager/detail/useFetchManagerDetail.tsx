import { useEffect } from "react";

import { useRouter } from "next/router";

import useUserQuery from "@/services/user/useUserQuery";

export default function useFetchManagerData() {
  const { managerId } = useRouter().query;
  const { userDetail, refetchUserDetail } = useUserQuery({ userId: managerId ? parseInt(managerId as string) : "" });

  useEffect(() => {
    if (managerId) {
      refetchUserDetail();
    }
  }, [managerId]);

  return {
    userDetail,
  };
}
