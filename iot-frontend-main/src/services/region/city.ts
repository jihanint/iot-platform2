import type { Response } from "@/interfaces/api";
import type { IRegionDataItem } from "@/interfaces/region";
import type { ICitiesParams, ICityFormStateParams } from "@/interfaces/region/city";
import callApi from "@/utils/api";

export const getCityList = async ({
  province_id,
  is_device_installed,
}: ICitiesParams): Promise<Response<IRegionDataItem[]>> =>
  callApi({
    method: "GET",
    url: "/region/cities",
    params: {
      province_id,
      is_device_installed,
    },
  });

export const createCity = async ({ name, province_id }: ICityFormStateParams): Promise<Response<IRegionDataItem>> =>
  callApi({
    method: "POST",
    url: "/region/cities",
    data: {
      name,
      province_id,
    },
  });
