import type { IPagination } from "../pagination";

// formatted api response that will be consumed by the component
export interface IReturnListApi<IListItem> {
  pagination: IPagination;
  list: IListItem[];
}

// api response
export interface IResponseListApi<IListItem> {
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  data?: IListItem[] | null;
}
