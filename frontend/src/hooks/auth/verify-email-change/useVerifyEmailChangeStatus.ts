import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { authService } from "@/services/authService";

export const useVerifyEmailChangeStatus = (token?: string) => {
  const [state, setState] = useState(() => getInitialState(token));
  useEffect(() => verifyEmailChangeToken(token, setState), [token]);
  return state;
};

const verifyEmailChangeToken = (token: string | undefined, setState: SetVerificationState) => {
  if (!token) return;
  authService.verifyEmailChange(token)
    .then(() => setState({ message: "Email baru berhasil diverifikasi.", status: "success" }))
    .catch((err) => setState({ message: getErrorMessage(err), status: "error" }));
};

const getInitialState = (token?: string): VerificationState =>
  token
    ? { message: "Memproses verifikasi email baru...", status: "loading" }
    : { message: "Token verifikasi tidak ditemukan.", status: "error" };

const getErrorMessage = (err: unknown) =>
  getApiErrorMessage(err, "Verifikasi email baru gagal");

export type VerificationStatus = "loading" | "success" | "error";
export type VerificationState = { message: string; status: VerificationStatus };
type SetVerificationState = (state: VerificationState) => void;
