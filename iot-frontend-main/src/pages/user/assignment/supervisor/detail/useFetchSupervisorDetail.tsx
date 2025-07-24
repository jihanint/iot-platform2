import { useEffect } from "react";

import { useRouter } from "next/router";

import useUserQuery from "@/services/user/useUserQuery";

export default function useFetchManagerData() {
  const { supervisorId } = useRouter().query;
  const { userDetail, refetchUserDetail } = useUserQuery({
    userId: supervisorId ? parseInt(supervisorId as string) : "",
  });

  useEffect(() => {
    if (supervisorId) {
      refetchUserDetail();
    }
  }, [supervisorId]);

  return {
    userDetail,
  };
}
