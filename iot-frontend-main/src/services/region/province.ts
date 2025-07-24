import type { Response } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";
import callApi from "@/utils/api";

export const getProvinceList = async (): Promise<Response<IRegionDataItem[]>> =>
  callApi({
    method: "GET",
    url: "/region/provinces",
  });
