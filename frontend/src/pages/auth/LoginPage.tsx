import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginInput } from '@/validations/auth';
import { authService } from '@/services/authService';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

// udh di fix, muncul sekarang kl di run dev, token dismpn lokal strg

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  // Inisialisasi React Hook Form dengan Zod Resolver
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      // 1. Panggil API Login
      const result = await authService.login(data.email, data.password);

      // Simpan ke global store
      setToken(result.token);
      setUser(result.user);

      // 2. Redirect berdasarkan Role (Role-Based Routing)
      navigate(result.user.role === 'TENANT' ? '/tenant/dashboard' : '/');
    } catch (err) {
      // 3. Error Handling untuk Axios
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const msg = axiosErr.response?.data?.message || 'Login gagal';
      
      // Set pesan error ke level 'root' agar bisa ditampilkan di atas form
      setError('root', { message: msg });
    }
  };

  return (
    <>
      {/* Header Form */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Masuk ke akun Anda</p>

      {/* Tampilan Error Root (Dari API) */}
      {errors.root && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{errors.root.message}</p>
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