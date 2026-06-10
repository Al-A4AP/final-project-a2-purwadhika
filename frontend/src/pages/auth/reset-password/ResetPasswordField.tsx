import { useState, type FC } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { ResetPasswordInput } from "@/validations/auth";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFieldProps {
  error?: string;
  label: string;
  name: keyof ResetPasswordInput;
  placeholder: string;
  register: UseFormRegister<ResetPasswordInput>;
}

export const ResetPasswordField: FC<ResetPasswordFieldProps> = ({ error, label, name, placeholder, register }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible((prev) => !prev);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <input {...register(name)} type={visible ? "text" : "password"} placeholder={placeholder} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-11 outline-none transition focus:ring-2 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        <button type="button" onClick={toggleVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
