import type { AxiosError } from "axios";
import axios from "axios";

export function handleApiError(error: unknown, customDescription?: string) {
  let description = "An unexpected error occurred";

  if (error instanceof Error) {
    description = error.message || customDescription || description;
  } else {
    console.error("Unexpected error:", error);
  }

  return description;
}

export function handleAxiosError(error: unknown): string {
  let description = "An unexpected error occurred";

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response && axiosError.response.data.message) {
      description = axiosError.response.data.message;
    } else {
      console.error("No response data in the Axios error");
    }
  }

  return description;
}
