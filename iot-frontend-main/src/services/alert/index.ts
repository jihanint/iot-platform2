import type { AlertListResponse } from "@/interfaces/alert";
import type { ResponseMessage } from "@/interfaces/api";
import callApi from "@/utils/api";

export const getAlertList = async ({
  area_id,
  page_number,
  page_size,
  start_date,
  end_date,
}: {
  area_id?: number;
  page_number?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}): Promise<AlertListResponse> =>
  callApi({
    method: "GET",
    url: "/alert/list",
    params: {
      area_id,
      page_number,
      page_size,
      start_time: start_date,
      end_time: end_date,
    },
  });

export const markAlertAsDone = async (alert_id: number): Promise<ResponseMessage> =>
  callApi({
    method: "PATCH",
    url: "/alert/done",
    data: {
      alert_id,
    },
  });

export const reviewAlert = async (alert_id: number, comment: string): Promise<ResponseMessage> =>
  callApi({
    method: "PATCH",
    url: "/alert/review",
    data: {
      alert_id,
      comment,
    },
  });
