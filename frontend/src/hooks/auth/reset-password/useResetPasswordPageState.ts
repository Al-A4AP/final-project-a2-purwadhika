import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validations/auth";
import { resetPasswordAction } from "../../../pages/auth/reset-password/resetPasswordActions";

export const useResetPasswordPageState = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });
  const submit = (data: ResetPasswordInput) => resetPasswordAction(data, {
    navigateLogin: () => navigate("/auth/login"),
    setError: form.setError,
    setSuccess,
    token: searchParams.get("token") || "",
  });
  return { form, submit, success };
};
