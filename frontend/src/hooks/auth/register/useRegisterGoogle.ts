import type { UseFormSetError } from "react-hook-form";
import type { NavigateFunction } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { authService } from "@/services/authService";
import { getRoleHome } from "@/lib/authRole";
import type { Role } from "@/types";
import type { RegisterInput } from "@/validations/auth";
import type { SetUser } from "../../../pages/auth/register/registerTypes";
import { notifyGoogleSuccess } from "../../../pages/auth/register/registerActions";

export const useRegisterGoogle = (
  role: Role,
  setError: UseFormSetError<RegisterInput>,
  setUser: SetUser,
  navigate: NavigateFunction,
) => useGoogleLogin({
  onSuccess: async (token) => handleGoogleSuccess(token.access_token, role, setError, setUser, navigate),
  onError: () => toast.error("Gagal terhubung ke Google"),
});

const handleGoogleSuccess = async (
  accessToken: string,
  role: Role,
  setError: UseFormSetError<RegisterInput>,
  setUser: SetUser,
  navigate: NavigateFunction,
) => {
  try {
    const result = await authService.googleLogin({ accessToken, role, mode: "register" });
    setUser(result.user);
    notifyGoogleSuccess();
    navigate(getRoleHome(result.user.role));
  } catch { handleGoogleError(setError); }
};

const handleGoogleError = (setError: UseFormSetError<RegisterInput>) => {
  setError("root", { message: "Gagal memproses pendaftaran Google" });
  toast.error("Gagal menggunakan Google");
};
