import { useState, type FC } from 'react';
import { useForm, type UseFormSetError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import type { Role, User } from '@/types';
import { getAuthRoleFromPath, getRoleHome, getRoleMismatchMessage, getRoleName, getRoleRegisterPath, type TargetAuthRole } from '@/lib/authRole';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

interface LoginPageProps {
  targetRole?: TargetAuthRole;
}

const selectSetUser = (state: { setUser: (user: User | null) => void }) => state.setUser;

const loginWithPassword = async (data: LoginInput, acceptLogin: (role: Role) => Promise<boolean>, setUser: (user: User) => void, navigate: (path: string) => void) => {
  const result = await authService.login(data.email, data.password);
  if (!(await acceptLogin(result.user.role))) return;
  setUser(result.user);
  toast.success('Login berhasil!');
  navigate(getRoleHome(result.user.role));
};

const handleLoginError = (err: unknown, email: string, setError: UseFormSetError<LoginInput>, setShowResend: (value: boolean) => void, setResendEmail: (value: string) => void) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  const msg = axiosErr.response?.data?.message || 'Login gagal';
  toast.error(msg);
  setError('root', { message: msg });
  if (axiosErr.response?.status === 403) { setShowResend(true); setResendEmail(email); }
};

const LoginPage: FC<LoginPageProps> = ({ targetRole }) => {
  const navigate = useNavigate();
  const role = targetRole || getAuthRoleFromPath(window.location.pathname);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore(selectSetUser);

  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Inisialisasi React Hook Form dengan Zod Resolver
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const acceptLogin = async (userRole: Role) => {
    if (!role || userRole === role) return true;
    await authService.logout().catch(() => undefined);
    const msg = getRoleMismatchMessage(role);
    toast.error(msg);
    setError('root', { message: msg });
    return false;
  };

  const onSubmit = async (data: LoginInput) => {
    setShowResend(false);
    setResendStatus('idle');
    try {
      await loginWithPassword(data, acceptLogin, setUser, navigate);
    } catch (err) {
      handleLoginError(err, data.email, setError, setShowResend, setResendEmail);
    }
  };

  const handleResend = async () => {
    try {
      setResendStatus('loading');
      await authService.resendVerification(resendEmail);
      setResendStatus('success');
      toast.success('Email verifikasi telah dikirim ulang');
    } catch {
      setResendStatus('error');
      toast.error('Gagal mengirim ulang email');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await authService.googleLogin({ accessToken: tokenResponse.access_token, role });
        if (!(await acceptLogin(result.user.role))) return;
        setUser(result.user); toast.success('Berhasil login menggunakan Google'); navigate(getRoleHome(result.user.role));
      } catch { setError('root', { message: 'Gagal memproses login Google' }); toast.error('Gagal login menggunakan Google'); }
    },
    onError: () => toast.error('Gagal terhubung ke Google')
  });

  return (
    <>
      {/* Header Form */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Masuk {getRoleName(role)}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Gunakan akun {getRoleName(role).toLowerCase()} Anda</p>

      {/* Tampilan Error Root (Dari API) */}
      {errors.root && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{errors.root.message}</p>
          {showResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendStatus === 'loading'}
              className="mt-2 text-xs font-semibold text-red-600 hover:underline block text-left"
            >
              {resendStatus === 'loading' ? 'Mengirim...' : 'Kirim ulang email verifikasi'}
            </button>
          )}
          {resendStatus === 'success' && (
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 font-medium flex items-center gap-1">
              <Check size={12} /> Email verifikasi baru berhasil dikirim. Silakan periksa inbox Anda.
            </p>
          )}
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="email@contoh.com"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Lupa Password Link */}
        <div className="flex justify-end">
          <Link to="/auth/forgot-password" className="text-sm text-red-600 hover:underline">
            Lupa password?
          </Link>
        </div>

        {/* Submit Button dengan Loading State */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-gray-300 dark:border-slate-600"></div>
          <span className="shrink mx-4 text-gray-500 text-xs">atau</span>
          <div className="grow border-t border-gray-300 dark:border-slate-600"></div>
        </div>

        <GoogleAuthButton label="Masuk dengan Google" onClick={() => handleGoogleLogin()} />
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Belum punya akun?{' '}
        <Link to={getRoleRegisterPath(role)} className="text-red-600 font-semibold hover:underline">Daftar sekarang</Link>
      </p>
    </>
  );
};

export default LoginPage;
