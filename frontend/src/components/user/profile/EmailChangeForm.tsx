import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import type { User } from '@/types';
import { emailChangeSchema, type EmailChangeInput } from '@/validations/profile';

interface Props {
  user: User | null;
  inputClass: string;
  onRequest: (email: string) => Promise<void>;
}

export const EmailChangeForm = ({ user, inputClass, onRequest }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<EmailChangeInput>({ resolver: zodResolver(emailChangeSchema) });

  const submit = async (data: EmailChangeInput) => {
    await onRequest(data.email);
    reset();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 mt-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Ubah Email</h2>
      <div className="mb-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3 text-sm">
        <p className="text-gray-600 dark:text-gray-400">Email saat ini</p>
        <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
        {user?.pending_email && (
          <p className="mt-2 text-amber-600 dark:text-amber-400">Menunggu verifikasi: {user.pending_email}</p>
        )}
      </div>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Baru</label>
          <input {...register('email')} placeholder="nama@email.com" className={inputClass} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 dark:bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <MailCheck size={18} />
          {isSubmitting ? 'Mengirim...' : 'Kirim Verifikasi Email Baru'}
        </button>
      </form>
    </div>
  );
};
