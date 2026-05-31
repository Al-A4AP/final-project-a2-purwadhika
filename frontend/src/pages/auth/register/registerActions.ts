import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import type { ApiResponse } from "@/types";

export const getRegisterErrorMessage = (err: unknown) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  return axiosErr.response?.data?.message || "Registrasi gagal";
};

export const notifyRegisterSuccess = () => {
  toast.success("Registrasi berhasil! Silakan periksa email Anda.");
};

export const notifyGoogleSuccess = () => {
  toast.success("Pendaftaran / Login Google berhasil");
};
