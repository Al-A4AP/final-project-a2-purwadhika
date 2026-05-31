import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import type { VerifyEmailStatus } from "./verifyEmailTypes";

export const getVerifyEmailError = (err: unknown) =>
  getApiErrorMessage(err, "Verifikasi gagal");

export const setVerifyEmailError = (
  setStatus: Dispatch<SetStateAction<VerifyEmailStatus>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  message: string,
) => {
  setErrorMessage(message);
  setStatus("error");
  toast.error(message);
};
