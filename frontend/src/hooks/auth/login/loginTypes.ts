import type { UseFormReturn } from "react-hook-form";
import type { TargetAuthRole } from "@/lib/authRole";
import type { LoginInput } from "@/validations/auth";

export interface LoginPageProps {
  targetRole?: TargetAuthRole;
}

export type ResendStatus = "idle" | "loading" | "success" | "error";

export interface LoginPageState {
  form: UseFormReturn<LoginInput>;
  handleGoogleLogin: () => void;
  handleResend: () => Promise<void>;
  onSubmit: (data: LoginInput) => Promise<void>;
  passwordVisible: boolean;
  resendStatus: ResendStatus;
  role?: TargetAuthRole;
  showResend: boolean;
  togglePassword: () => void;
}
