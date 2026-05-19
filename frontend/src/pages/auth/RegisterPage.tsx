import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { role: 'USER' } });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const result = await authService.register(data);
      setToken(result.token);
      setUser(result.user);
      navigate('/');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Registrasi gagal';
      setError('root', { message: msg });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Buat Akun</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Bergabung dengan Property Renting</p>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
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
