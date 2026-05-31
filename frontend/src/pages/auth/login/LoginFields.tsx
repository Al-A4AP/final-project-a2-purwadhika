import type { FC } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LoginPageState } from "./loginTypes";

const INPUT_CLASS = "w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition";

export const EmailField: FC<{ state: LoginPageState }> = ({ state }) => {
  const error = state.form.formState.errors.email;
  return <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input {...state.form.register("email")} type="email" placeholder="email@contoh.com" className={INPUT_CLASS} />{error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}</div>;
};

export const PasswordField: FC<{ state: LoginPageState }> = ({ state }) => {
  const error = state.form.formState.errors.password;
  return <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><div className="relative"><input {...state.form.register("password")} type={state.passwordVisible ? "text" : "password"} placeholder="********" className={INPUT_CLASS} /><button type="button" onClick={state.togglePassword} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">{state.passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}</div>;
};
