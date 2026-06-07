import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import { getAuthRoleFromPath, getRoleHome, getRoleMismatchMessage } from "@/lib/authRole";
import { loginSchema, type LoginInput } from "@/validations/auth";
import type { Role, User } from "@/types";
import { handleLoginError, loginWithPassword } from "./loginActions";
import type { LoginPageState, ResendStatus } from "./loginTypes";

type SetLoginError = ReturnType<typeof useForm<LoginInput>>["setError"];
type LoginNavigate = ReturnType<typeof useNavigate>;

const selectSetUser = (state: { setUser: (user: User | null) => void }) => state.setUser;

export const useLoginPageState = (targetRole?: LoginPageState["role"]): LoginPageState => {
  const role = useTargetRole(targetRole);
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const password = usePasswordVisibility();
  const resend = useResendVerification();
  const actions = useLoginActions(role, form.setError, resend);
  return { form, role, ...password, ...resend, ...actions };
};

const useTargetRole = (targetRole?: LoginPageState["role"]) => {
  const location = useLocation();
  return targetRole || getAuthRoleFromPath(location.pathname);
};

const usePasswordVisibility = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return { passwordVisible, togglePassword: () => setPasswordVisible((value) => !value) };
};

const useResendVerification = () => {
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const handleResend = useResendAction(resendEmail, setResendStatus);
  const resetResend = useCallback(() => { setShowResend(false); setResendStatus("idle"); }, []);
  const showResendForEmail = useCallback((email: string) => { setShowResend(true); setResendEmail(email); }, []);
  return { handleResend, resendStatus, resetResend, showResend, showResendForEmail };
};

const useResendAction = (email: string, setStatus: (status: ResendStatus) => void) =>
  useCallback(async () => {
    try {
      setStatus("loading");
      await authService.resendVerification(email);
      setStatus("success");
      toast.success("Email verifikasi telah dikirim ulang");
    } catch { setStatus("error"); toast.error("Gagal mengirim ulang email"); }
  }, [email, setStatus]);

const useLoginActions = (
  role: LoginPageState["role"],
  setError: SetLoginError,
  resend: ReturnType<typeof useResendVerification>,
) => {
  const navigate = useNavigate();
  const setUser = useAuthStore(selectSetUser);
  const acceptLogin = useRoleGuard(role, setError);
  const onSubmit = usePasswordSubmit(acceptLogin, setUser, navigate, setError, resend.resetResend, resend.showResendForEmail);
  const handleGoogleLogin = useGoogleLoginAction(role, acceptLogin, setUser, navigate, setError);
  return { handleGoogleLogin, onSubmit };
};

const usePasswordSubmit = (
  acceptLogin: (role: Role) => Promise<boolean>,
  setUser: (user: User) => void,
  navigate: LoginNavigate,
  setError: SetLoginError,
  resetResend: () => void,
  showResend: (email: string) => void,
) => useCallback(async (data: LoginInput) => {
  resetResend();
  try { await loginWithPassword(data, acceptLogin, setUser, navigate); }
  catch (err) { handleLoginError(err, data.email, setError, showResend); }
}, [acceptLogin, navigate, resetResend, setError, setUser, showResend]);

const useRoleGuard = (
  role: LoginPageState["role"],
  setError: SetLoginError,
) => useCallback(async (userRole: Role) => {
  if (!role || userRole === role) return true;
  await authService.logout().catch(() => undefined);
  const msg = getRoleMismatchMessage(role);
  toast.error(msg);
  setError("root", { message: msg });
  return false;
}, [role, setError]);

const useGoogleLoginAction = (
  role: LoginPageState["role"],
  acceptLogin: (role: Role) => Promise<boolean>,
  setUser: (user: User) => void,
  navigate: LoginNavigate,
  setError: SetLoginError,
) => useGoogleLogin({
  onSuccess: async (token) => handleGoogleSuccess(token.access_token, role, acceptLogin, setUser, navigate, setError),
  onError: () => toast.error("Gagal terhubung ke Google"),
});

const handleGoogleSuccess = async (
  accessToken: string,
  role: LoginPageState["role"],
  acceptLogin: (role: Role) => Promise<boolean>,
  setUser: (user: User) => void,
  navigate: LoginNavigate,
  setError: SetLoginError,
) => {
  try {
    const result = await authService.googleLogin({ accessToken, role, mode: "login" });
    await acceptGoogleResult(result.user, acceptLogin, setUser, navigate);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      toast.error("Akun Google belum terdaftar. Silakan registrasi terlebih dahulu.");
      navigate("/auth/register");
    } else {
      showGoogleLoginError(setError);
    }
  }
};

const acceptGoogleResult = async (
  user: User,
  acceptLogin: (role: Role) => Promise<boolean>,
  setUser: (user: User) => void,
  navigate: LoginNavigate,
) => {
  if (!(await acceptLogin(user.role))) return;
  setUser(user);
  toast.success("Berhasil login menggunakan Google");
  navigate(getRoleHome(user.role));
};

const showGoogleLoginError = (setError: SetLoginError) => {
  setError("root", { message: "Gagal memproses login Google" });
  toast.error("Gagal login menggunakan Google");
};
