import type { UseFormSetError } from "react-hook-form";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { authService } from "@/services/authService";
import { getRoleHome } from "@/lib/authRole";
import type { ApiResponse, Role, User } from "@/types";
import type { LoginInput } from "@/validations/auth";

export const loginWithPassword = async (
  data: LoginInput,
  acceptLogin: (role: Role) => Promise<boolean>,
  setUser: (user: User) => void,
  navigate: NavigateFunction,
) => {
  const result = await authService.login(data.email, data.password);
  if (!(await acceptLogin(result.user.role))) return;
  setUser(result.user);
  toast.success("Login berhasil!");
  navigate(getRoleHome(result.user.role));
};

export const handleLoginError = (
  err: unknown,
  email: string,
  setError: UseFormSetError<LoginInput>,
  showResend: (email: string) => void,
) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  const msg = axiosErr.response?.data?.message || "Login gagal";
  toast.error(msg);
  setError("root", { message: msg });
  if (axiosErr.response?.status === 403) showResend(email);
};
