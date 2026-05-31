import type { Dispatch, SetStateAction } from "react";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import type { ApiResponse } from "@/types";
import type { VerifyEmailStatus } from "./verifyEmailTypes";

export const getVerifyEmailError = (err: unknown) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  return axiosErr.response?.data?.message || "Verifikasi gagal";
};

export const setVerifyEmailError = (
  setStatus: Dispatch<SetStateAction<VerifyEmailStatus>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  message: string,
) => {
  setErrorMessage(message);
  setStatus("error");
  toast.error(message);
};
