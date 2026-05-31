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
import type { Role, User } from '@/types';
import { getAuthRoleFromPath, getRoleHome, getRoleLoginPath, getRoleName, type TargetAuthRole } from '@/lib/authRole';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

interface RegisterPageProps {
  targetRole?: TargetAuthRole;
}

const selectSetUser = (state: { setUser: (user: User | null) => void }) => state.setUser;

const RegisterPage: FC<RegisterPageProps> = ({ targetRole }) => {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const role = targetRole || getAuthRoleFromPath(window.location.pathname);
  const defaultRole: Role = role || 'USER';
  const navigate = useNavigate();
  const setUser = useAuthStore(selectSetUser);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await authService.googleLogin({
          accessToken: tokenResponse.access_token,
          role: defaultRole,
        });
        setUser(result.user);
        toast.success('Pendaftaran / Login Google berhasil');
        navigate(getRoleHome(result.user.role));
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daftar Sebagai {getRoleName(defaultRole)}</h2>
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

        {!role && (
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

        <GoogleAuthButton label="Daftar dengan Google" onClick={() => handleGoogleLogin()} />
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Sudah punya akun?{' '}
        <Link to={getRoleLoginPath(defaultRole)} className="text-red-600 font-semibold hover:underline">Masuk</Link>
      </p>
    </>
  );
};

export default RegisterPage;
