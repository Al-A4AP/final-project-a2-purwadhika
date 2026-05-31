import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { VerifyEmailInput } from "@/validations/auth";

export type VerifyEmailStatus = "form" | "loading" | "success" | "error";

export type VerifyEmailPageState = {
  form: UseFormReturn<VerifyEmailInput>;
  status: VerifyEmailStatus;
  errorMessage: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
  onSubmit: SubmitHandler<VerifyEmailInput>;
  retry: () => void;
};
