import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { VerifyEmailInput } from "@/validations/auth";

export type VerifyEmailStatus = "form" | "loading" | "success" | "error";

export type VerifyEmailPageState = {
  errorMessage: string;
  form: UseFormReturn<VerifyEmailInput>;
  onSubmit: SubmitHandler<VerifyEmailInput>;
  retry: () => void;
  showConfirmPassword: boolean;
  showPassword: boolean;
  status: VerifyEmailStatus;
  toggleConfirmPassword: () => void;
  togglePassword: () => void;
};
