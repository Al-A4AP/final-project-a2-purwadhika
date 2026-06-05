import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { authService } from "@/services/authService";
import { verifyEmailSchema, type VerifyEmailInput } from "@/validations/auth";
import { getVerifyEmailError, setVerifyEmailError } from "../../../pages/auth/verify-email/verifyEmailActions";
import type { VerifyEmailPageState, VerifyEmailStatus } from "../../../pages/auth/verify-email/verifyEmailTypes";

export const useVerifyEmailPageState = (): VerifyEmailPageState => {
  const { token } = useParams<{ token: string }>();
  const form = useForm<VerifyEmailInput>({ resolver: zodResolver(verifyEmailSchema) });
  const status = useVerifyStatus();
  const password = usePasswordVisibility();
  const onSubmit = useVerifyEmailSubmit(token, status);
  return { form, ...status, ...password, onSubmit };
};

const useVerifyStatus = () => {
  const [status, setStatus] = useState<VerifyEmailStatus>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const retry = () => setStatus("form");
  return { status, setStatus, errorMessage, setErrorMessage, retry };
};

const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return {
    showPassword,
    showConfirmPassword,
    togglePassword: () => setShowPassword((visible) => !visible),
    toggleConfirmPassword: () => setShowConfirmPassword((visible) => !visible),
  };
};

const useVerifyEmailSubmit = (
  token: string | undefined,
  status: ReturnType<typeof useVerifyStatus>,
) => useCallback(async (data: VerifyEmailInput) => {
  if (!token) return setVerifyEmailError(status.setStatus, status.setErrorMessage, "Token verifikasi tidak ditemukan.");
  try {
    status.setStatus("loading");
    await authService.verifyEmail(token, data.password);
    status.setStatus("success");
    toast.success("Email berhasil diverifikasi!");
  } catch (err) {
    setVerifyEmailError(status.setStatus, status.setErrorMessage, getVerifyEmailError(err));
  }
}, [status, token]);
