import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations/auth";
import { forgotPasswordAction } from "./forgotPasswordActions";

export const useForgotPasswordState = () => {
  const [sent, setSent] = useState(false);
  const form = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });
  const submit = (data: ForgotPasswordInput) => forgotPasswordAction(data, {
    setError: form.setError,
    setSent,
  });
  return { form, sent, submit };
};
