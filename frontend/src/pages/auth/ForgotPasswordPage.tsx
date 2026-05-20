import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage: FC = () => {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
      toast.success('Link reset password dikirim!');
    } catch {
      toast.error('Terjadi kesalahan, coba lagi.');
      setError('root', { message: 'Terjadi kesalahan, coba lagi.' });
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Dikirim!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Jika email terdaftar, link reset password akan dikirim. Cek inbox Anda.</p>
        <Link to="/auth/login" className="text-red-600 hover:underline">Kembali ke Login</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lupa Password</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Masukkan email Anda untuk menerima link reset password.</p>

      {errors.root && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
          {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset'}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        <Link to="/auth/login" className="text-red-600 hover:underline">← Kembali ke Login</Link>
      </p>
    </>
  );
};

export default ForgotPasswordPage;
