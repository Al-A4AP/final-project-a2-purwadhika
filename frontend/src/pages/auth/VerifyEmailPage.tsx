import type { FC } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { verifyEmailSchema, type VerifyEmailInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { toast } from 'react-hot-toast';

const VerifyEmailPage: FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<VerifyEmailInput>({ resolver: zodResolver(verifyEmailSchema) });

  const onSubmit = async (data: VerifyEmailInput) => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token verifikasi tidak ditemukan.');
      return;
    }

    try {
      setStatus('loading');
      await authService.verifyEmail(token, data.password);
      setStatus('success');
      toast.success('Email berhasil diverifikasi!');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Verifikasi gagal';
      setErrorMessage(msg);
      setStatus('error');
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      {status === 'form' && (
        <>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Password Anda</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Atur password Anda untuk mengaktifkan akun <span className="text-rose-600 font-bold">PURWA</span><span className="text-slate-900 dark:text-white font-bold">LOKA</span> Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Baru
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              Verifikasi & Aktifkan Akun
            </button>
          </form>
        </>
      )}

      {status === 'loading' && (
        <div className="text-center py-8">
          <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Memproses verifikasi...</h2>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center py-6">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Terverifikasi!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Akun Anda sudah aktif dan siap digunakan. Silakan login untuk masuk ke aplikasi.
          </p>
          <Link
            to="/auth/login"
            className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Masuk Sekarang
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-6">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifikasi Gagal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage || 'Token tidak valid, sudah kadaluarsa, atau sudah pernah digunakan.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStatus('form')}
              className="inline-block text-red-600 font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
            >
              Coba Lagi
            </button>
            <div>
              <Link to="/auth/login" className="text-gray-500 hover:text-gray-700 text-sm">
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
