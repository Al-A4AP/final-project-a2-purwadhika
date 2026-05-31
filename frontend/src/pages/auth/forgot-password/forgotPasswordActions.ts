import type { UseFormSetError } from "react-hook-form";
import { toast } from "react-hot-toast";
import { authService } from "@/services/authService";
import type { ForgotPasswordInput } from "@/validations/auth";

interface ForgotPasswordActionOptions {
  setError: UseFormSetError<ForgotPasswordInput>;
  setSent: (sent: boolean) => void;
}

export const forgotPasswordAction = async (data: ForgotPasswordInput, options: ForgotPasswordActionOptions) => {
  try {
    await authService.forgotPassword(data.email);
    options.setSent(true);
    toast.success("Link reset password dikirim!");
  } catch {
    toast.error("Terjadi kesalahan, coba lagi.");
    options.setError("root", { message: "Terjadi kesalahan, coba lagi." });
  }
};
