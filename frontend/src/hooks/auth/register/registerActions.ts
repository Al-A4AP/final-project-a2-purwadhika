import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";

export const getRegisterErrorMessage = (err: unknown) =>
  getApiErrorMessage(err, "Registrasi gagal");

export const notifyRegisterSuccess = () => {
  toast.success("Registrasi berhasil! Silakan periksa email Anda.");
};

export const notifyGoogleSuccess = () => {
  toast.success("Pendaftaran / Login Google berhasil");
};
