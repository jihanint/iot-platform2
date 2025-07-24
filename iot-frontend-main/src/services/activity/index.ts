import type { ActivityHistoryResponse, GroupedActivityHistoreResponse } from "@/interfaces/activity";
import type { Response } from "@/interfaces/api";
import type { IChartPeriod } from "@/interfaces/layout";
import callApi from "@/utils/api";

export const getActivityHistList = async ({
  page_size,
  page_number,
  interval = "day",
}: {
  page_size?: number;
  page_number?: number;
  interval?: IChartPeriod;
}): Promise<Response<ActivityHistoryResponse>> =>
  callApi({
    method: "GET",
    url: "/activity/histories",
    params: {
      page_size,
      page_number,
      interval,
    },
  });

export const getGroupedActivityHistList = async ({
  village_id,
}: {
  village_id: string | number;
}): Promise<GroupedActivityHistoreResponse> =>
  callApi({
    method: "GET",
    url: "/activity/histories-grouped",
    params: {
      village_id,
    },
  });
