import { useQuery } from "@tanstack/react-query";

import { getDeviceList } from "./index";
import type { IRequestGetDeviceList } from "./type";

interface IUseDeviceQuery extends IRequestGetDeviceList {
  isEnabled?: boolean;
}

export default function useDeviceQuery({ isEnabled = false, ...props }: IUseDeviceQuery) {
  const { data: deviceList, refetch: refetchDeviceList } = useQuery({
    queryKey: ["DEVICE_LIST"],
    queryFn: () =>
      getDeviceList({
        order_by: props.order_by,
        sort_by: props.sort_by,
        status: props.status,
        search: props.search,
      }),
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  });

  return {
    deviceList: deviceList?.data || [],
    refetchDeviceList,
  };
}
