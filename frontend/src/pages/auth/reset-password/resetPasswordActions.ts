import type { UseFormSetError } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { authService } from "@/services/authService";
import type { ResetPasswordInput } from "@/validations/auth";

interface ResetPasswordActionOptions {
  navigateLogin: () => void;
  setError: UseFormSetError<ResetPasswordInput>;
  setSuccess: (success: boolean) => void;
  token: string;
}

export const resetPasswordAction = async (data: ResetPasswordInput, options: ResetPasswordActionOptions) => {
  if (!options.token) return options.setError("root", { message: "Token tidak ditemukan di URL." });
  try {
    await authService.resetPassword(options.token, data.password);
    options.setSuccess(true);
    toast.success("Password berhasil direset!");
    setTimeout(options.navigateLogin, 2000);
  } catch (err) {
    const message = getApiErrorMessage(err, "Reset gagal, token tidak valid.");
    toast.error(message);
    options.setError("root", { message });
  }
};
