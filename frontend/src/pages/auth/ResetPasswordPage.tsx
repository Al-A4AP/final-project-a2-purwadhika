import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { toast } from 'react-hot-toast';

const ResetPasswordPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token') || '';

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) return setError('root', { message: 'Token tidak ditemukan di URL.' });
    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
      toast.success('Password berhasil direset!');
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Reset gagal, token tidak valid.';
      toast.error(msg);
      setError('root', { message: msg });
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Berhasil Direset!</h2>
        <p className="text-gray-600 dark:text-gray-400">Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Masukkan password baru Anda.</p>

      {errors.root && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru</label>
          <input
            {...register('password')}
            type="password"
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Ulangi password baru"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          {isSubmitting ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        <Link to="/auth/login" className="text-red-600 hover:underline">← Kembali ke Login</Link>
      </p>
    </>
  );
};

export default ResetPasswordPage;
