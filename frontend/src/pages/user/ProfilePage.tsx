import type { FC } from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Camera, Loader2, Eye, EyeOff } from 'lucide-react';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional().or(z.literal('')),
  phone: z.string().optional(),
});
type FormInput = z.infer<typeof schema>;

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
});
type PasswordFormInput = z.infer<typeof passwordSchema>;

const ProfilePage: FC = () => {
  const { user, setUser } = useAuthStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormInput>({
      resolver: zodResolver(schema),
      defaultValues: { name: user?.name || '', phone: user?.phone || '' },
    });

  const onSubmit = async (data: FormInput) => {
    try {
      const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
      const updated = await userService.updateProfile(payload);
      setUser(updated);
      toast.success('Profil berhasil disimpan!');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Gagal menyimpan perubahan');
    }
  };

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword } 
  } = useForm<PasswordFormInput>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async (data: PasswordFormInput) => {
    try {
      await userService.changePassword({ old_password: data.old_password, new_password: data.new_password });
      toast.success('Password berhasil diubah!');
      resetPassword();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Gagal mengubah password');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const updated = await userService.updateAvatar(file);
      setUser(updated);
      toast.success('Foto profil berhasil diperbarui');
    } catch { 
      toast.error('Gagal upload avatar'); 
    }
    finally { setUploadingAvatar(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profil Saya</h1>

        {/* Avatar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <User size={32} className="text-red-600" />
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
              >
                {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 px-2 py-0.5 rounded-full">
                {user?.role === 'TENANT' ? 'Pemilik Properti' : 'Penyewa'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Edit Informasi</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
              <input {...register('name')} placeholder={user?.name} className={inputClass} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input value={user?.email || ''} disabled className={inputClass + ' opacity-60 cursor-not-allowed'} />
              <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon</label>
              <input {...register('phone')} placeholder="+62 812 xxxx xxxx" className={inputClass} />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Form Ubah Password */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 mt-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Ubah Password</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Lama</label>
              <input type="password" {...registerPassword('old_password')} placeholder="••••••••" className={inputClass} />
              {passwordErrors.old_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.old_password.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru</label>
              <div className="relative">
                <input type={showNewPassword ? 'text' : 'password'} {...registerPassword('new_password')} placeholder="••••••••" className={inputClass} />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.new_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Password Baru</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} {...registerPassword('confirm_password')} placeholder="••••••••" className={inputClass} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmittingPassword}
              className="w-full bg-slate-900 dark:bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmittingPassword ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : 'Perbarui Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
