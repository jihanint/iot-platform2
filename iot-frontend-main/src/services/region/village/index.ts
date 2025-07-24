import type { ApiResponse } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";
import type { IGetVillageDetailParams, IGetVillageDetailResponse } from "@/interfaces/region/village";
import callApi from "@/utils/api";

import type { IGetVillageListParams } from "./type";

export const getVillageList = async ({
  district_id,
  is_assigned_for,
  is_device_installed,
  search,
}: IGetVillageListParams): Promise<ApiResponse<IRegionDataItem[]>> =>
  callApi({
    method: "GET",
    url: "/region/villages",
    params: {
      district_id,
      is_assigned_for,
      is_device_installed,
      search,
    },
  });

export const getVillageDetail = async ({ village_id }: IGetVillageDetailParams): Promise<IGetVillageDetailResponse> =>
  callApi({
    method: "GET",
    url: "/region/village",
    params: {
      village_id,
    },
  });
