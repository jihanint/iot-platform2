import type { Response } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";
import type { GetDistrictListParams } from "@/interfaces/region/district";
import callApi from "@/utils/api";

export const getDistrictList = async ({ city_id }: GetDistrictListParams): Promise<Response<IRegionDataItem[]>> =>
  callApi({
    method: "GET",
    url: "/region/districts",
    params: {
      city_id,
    },
  });
