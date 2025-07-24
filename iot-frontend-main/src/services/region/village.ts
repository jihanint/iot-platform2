import type { Response } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";
import type {
  IGetVillageDetailParams,
  IGetVillageDetailResponse,
  IGetVillageParams,
} from "@/interfaces/region/village";
import callApi from "@/utils/api";

export const getVillageList = async ({
  district_id,
  is_assigned_for,
  is_device_installed,
  search,
}: IGetVillageParams): Promise<Response<IRegionDataItem[]>> =>
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
