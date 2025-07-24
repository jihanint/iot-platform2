export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export interface Response<T> {
  data: T;
}

export interface ResponseMessage {
  message: string;
}
