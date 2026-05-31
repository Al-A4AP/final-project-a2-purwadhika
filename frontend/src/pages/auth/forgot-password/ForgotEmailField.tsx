import type { FC } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { ForgotPasswordInput } from "@/validations/auth";

export const ForgotEmailField: FC<{ error?: string; register: UseFormRegister<ForgotPasswordInput> }> = ({ error, register }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
    <input {...register("email")} type="email" placeholder="email@contoh.com" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
