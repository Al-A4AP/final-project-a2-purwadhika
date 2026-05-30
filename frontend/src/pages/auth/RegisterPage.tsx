import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { UserPlus, Loader2, MailCheck } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const RegisterPage: FC = () => {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const isTenantRegister = window.location.pathname.includes('/tenant');
  const isUserRegister = window.location.pathname.includes('/user');
  const defaultRole = isTenantRegister ? 'TENANT' : 'USER';
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await authService.googleLogin({
          accessToken: tokenResponse.access_token,
        });
        setUser(result.user);
        toast.success('Pendaftaran / Login Google berhasil');
        navigate('/');
      } catch {
        setError('root', { message: 'Gagal memproses pendaftaran Google' });
        toast.error('Gagal menggunakan Google');
      }
    },
    onError: () => {
      toast.error('Gagal terhubung ke Google');
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { role: defaultRole } });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const result = await authService.register(data);
      setRegisteredEmail(result.email);
      toast.success('Registrasi berhasil! Silakan periksa email Anda.');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Registrasi gagal';
      toast.error(msg);
      setError('root', { message: msg });
    }
  };

  if (registeredEmail) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200 dark:border-green-800">
          <MailCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registrasi Sukses!</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
          Email verifikasi telah dikirim ke <span className="font-semibold text-gray-900 dark:text-white">{registeredEmail}</span>. 
          Silakan periksa kotak masuk email Anda untuk melakukan verifikasi dan mengatur password Anda.
        </p>
        <Link 
          to="/auth/login" 
          className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Daftar Sebagai {isTenantRegister ? 'Tenant' : 'Penyewa'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Bergabung dengan <span className="text-rose-600 font-bold">PURWA</span><span className="text-slate-900 dark:text-white font-bold">LOKA</span></p>

      {errors.root && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{errors.root.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
          <input
            {...register('name')}
            placeholder="Nama Anda"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

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

        {!isTenantRegister && !isUserRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daftar sebagai</label>
            <select
              {...register('role')}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
            >
              <option value="USER">Penyewa (Pencari Properti)</option>
              <option value="TENANT">Pemilik Properti (Tenant)</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
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
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.28 1 3.28 3.73 1.34 7.73l3.87 3a7.16 7.16 0 0 1 6.79-5.69z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44a5.51 5.51 0 0 1-2.39 3.62l3.71 2.87c2.17-2 3.43-4.94 3.43-8.59z"
            />
            <path
              fill="#FBBC05"
              d="M5.21 14.73A7.13 7.13 0 0 1 4.8 12c0-.96.16-1.9.41-2.73L1.34 6.27A11.96 11.96 0 0 0 0 12c0 2.12.55 4.12 1.5 5.88l3.71-3.15z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.69 0-6.8-2.49-7.91-5.83l-3.87 3A11.97 11.97 0 0 0 12 23z"
            />
          </svg>
          Daftar dengan Google
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Sudah punya akun?{' '}
        <Link to="/auth/login" className="text-red-600 font-semibold hover:underline">Masuk</Link>
      </p>
    </>
  );
};

export default RegisterPage;
