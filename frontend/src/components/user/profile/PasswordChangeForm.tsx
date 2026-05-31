import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { passwordSchema, type PasswordInput } from '@/validations/profile';

interface Props {
  inputClass: string;
  onSave: (data: { old_password: string; new_password: string }) => Promise<void>;
}

interface PasswordFieldProps {
  label: string;
  name: 'new_password' | 'confirm_password';
  inputClass: string;
  show: boolean;
  toggle: () => void;
  register: UseFormRegister<PasswordInput>;
  error?: string;
}

export const PasswordChangeForm = ({ inputClass, onSave }: Props) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) });

  const submit = async (data: PasswordInput) => {
    await onSave({ old_password: data.old_password, new_password: data.new_password });
    reset();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 mt-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Ubah Password</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Lama</label>
          <input type="password" {...register('old_password')} placeholder="Minimal 8 karakter" className={inputClass} />
          {errors.old_password && <p className="text-red-500 text-xs mt-1">{errors.old_password.message}</p>}
        </div>
        <PasswordInputField
          label="Password Baru"
          name="new_password"
          inputClass={inputClass}
          show={showNewPassword}
          toggle={() => setShowNewPassword((value) => !value)}
          register={register}
          error={errors.new_password?.message}
        />
        <PasswordInputField
          label="Konfirmasi Password Baru"
          name="confirm_password"
          inputClass={inputClass}
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword((value) => !value)}
          register={register}
          error={errors.confirm_password?.message}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 dark:bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : 'Perbarui Password'}
        </button>
      </form>
    </div>
  );
};

const PasswordInputField = ({ label, name, inputClass, show, toggle, register, error }: PasswordFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div className="relative">
      <input type={show ? 'text' : 'password'} {...register(name)} placeholder="Minimal 8 karakter" className={inputClass} />
      <button type="button" onClick={toggle} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
