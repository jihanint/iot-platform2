import { useQuery } from "@tanstack/react-query";

import { getVillageList } from "..";
import type { IGetVillageListParams } from "./type";

interface IUseVillageQuery extends IGetVillageListParams {
  isEnabled?: boolean;
}

export default function useVillageQuery({ isEnabled = false, ...props }: IUseVillageQuery) {
  const { data: villageList, refetch: refetchVillageList } = useQuery({
    queryKey: ["VILLAGE_LIST"],
    queryFn: () =>
      getVillageList({
        district_id: props.district_id,
        is_assigned_for: props.is_assigned_for,
        is_device_installed: props.is_device_installed,
        search: props.search,
      }),
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  });

  return {
    villageList: villageList?.data || [],
    refetchVillageList,
  };
}
