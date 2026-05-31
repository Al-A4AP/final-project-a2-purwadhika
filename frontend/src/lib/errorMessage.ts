import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

export const getApiErrorMessage = (err: unknown, fallback: string) => {
  const axiosErr = err as AxiosError<ApiResponse<unknown>>;
  const message = axiosErr.response?.data?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
};
