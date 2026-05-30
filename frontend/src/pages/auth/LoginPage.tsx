import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
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

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Inisialisasi React Hook Form dengan Zod Resolver
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      setShowResend(false);
      setResendStatus('idle');
      // 1. Panggil API Login
      const result = await authService.login(data.email, data.password);

      // Simpan user ke global store (token sudah di cookies by server)
      setUser(result.user);

      // 2. Redirect berdasarkan Role (Role-Based Routing)
      toast.success('Login berhasil!');
      navigate(result.user.role === 'TENANT' ? '/tenant/dashboard' : '/');
    } catch (err) {
      // 3. Error Handling untuk Axios
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Login gagal';
      
      toast.error(msg);
      // Set pesan error ke level 'root' agar bisa ditampilkan di atas form
      setError('root', { message: msg });

      if (axiosErr.response?.status === 403) {
        setShowResend(true);
        setResendEmail(data.email);
      }
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
        const result = await authService.googleLogin({ accessToken: tokenResponse.access_token });
        setUser(result.user); toast.success('Berhasil login menggunakan Google'); navigate('/');
      } catch { setError('root', { message: 'Gagal memproses login Google' }); toast.error('Gagal login menggunakan Google'); }
    },
    onError: () => toast.error('Gagal terhubung ke Google')
  });

  return (
    <>
      {/* Header Form */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Masuk ke akun Anda</p>

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

        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 py-2.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.28 1 3.28 3.73 1.34 7.73l3.87 3a7.16 7.16 0 0 1 6.79-5.69z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44a5.51 5.51 0 0 1-2.39 3.62l3.71 2.87c2.17-2 3.43-4.94 3.43-8.59z" />
            <path fill="#FBBC05" d="M5.21 14.73A7.13 7.13 0 0 1 4.8 12c0-.96.16-1.9.41-2.73L1.34 6.27A11.96 11.96 0 0 0 0 12c0 2.12.55 4.12 1.5 5.88l3.71-3.15z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.69 0-6.8-2.49-7.91-5.83l-3.87 3A11.97 11.97 0 0 0 12 23z" />
          </svg>
          Masuk dengan Google
        </button>
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Belum punya akun?{' '}
        <Link to="/auth/register" className="text-red-600 font-semibold hover:underline">Daftar sekarang</Link>
      </p>
    </>
  );
};

export default LoginPage;
