import type { FC } from "react";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

export const RegisterErrorNotice: FC<{ state: RegisterPageState }> = ({ state }) => {
  const error = state.form.formState.errors.root;
  return error ? <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4"><p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p></div> : null;
};
