import { useQuery } from "@tanstack/react-query";

import { getUserDetail } from ".";

interface IUseUserQueryProps {
  userId?: number | string;
}

export default function useUserQuery({ ...props }: IUseUserQueryProps) {
  /**
   * Get: User assignment list data
   */
  const {
    data: userDetail,
    isFetching: isFetchingUserDetail,
    error: errorFetchingUserDetail,
    isError: isErrorFetchingUserDetail,
    refetch: refetchUserDetail,
  } = useQuery({
    queryKey: ["USER_DETAIL"],
    queryFn: () => (props.userId ? getUserDetail({ user_id: props.userId }) : null),
    enabled: false,
    cacheTime: 0,
    staleTime: 0,
    networkMode: "always",
    refetchOnWindowFocus: false,
  });

  return {
    userDetail: userDetail,
    isFetchingUserDetail,
    errorFetchingUserDetail,
    isErrorFetchingUserDetail,
    refetchUserDetail,
  };
}
