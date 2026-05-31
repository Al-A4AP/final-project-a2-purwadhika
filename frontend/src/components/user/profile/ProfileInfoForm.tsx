import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { User } from '@/types';
import { profileSchema, type ProfileInput } from '@/validations/profile';

interface Props {
  user: User | null;
  inputClass: string;
  onSave: (data: { name?: string; phone?: string }) => Promise<void>;
}

const compactProfileData = (data: ProfileInput) =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ''));

export const ProfileInfoForm = ({ user, inputClass, onSave }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Edit Informasi</h2>
      <form onSubmit={handleSubmit((data) => onSave(compactProfileData(data)))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
          <input {...register('name')} placeholder={user?.name} className={inputClass} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon</label>
          <input {...register('phone')} placeholder="+62 812 xxxx xxxx" className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};
