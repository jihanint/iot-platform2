import callApi from "@/utils/api";

import type { IRequestUserManagerAssignment, IResponseUserUnassignmentList, TResponseUserAssignedList } from "./type";

export const getUserAssignedList = async (): TResponseUserAssignedList =>
  await callApi({
    method: "GET",
    url: "/user/assignment-list",
  });

export const getUserUnassignedList = async (): IResponseUserUnassignmentList =>
  await callApi({
    method: "GET",
    url: "/user/unassign-list",
  });

// TODO: don't use any
export const postUserAssignment = async (payload: any) =>
  await callApi({
    method: "POST",
    url: "/user/assignment",
    data: {
      ...payload,
    },
  });

export const postRegisterAndAssignManger = async (payload: IRequestUserManagerAssignment) => {
  await callApi({
    method: "POST",
    url: "/user/register-assign",
    data: {
      ...payload,
    },
  });
};
