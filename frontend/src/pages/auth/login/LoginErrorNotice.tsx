import type { FC } from "react";
import { Check } from "lucide-react";
import type { LoginPageState } from "./loginTypes";

export const LoginErrorNotice: FC<{ state: LoginPageState }> = ({ state }) => {
  const error = state.form.formState.errors.root;
  if (!error) return null;
  return <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4"><p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>{state.showResend && <ResendButton state={state} />}{state.resendStatus === "success" && <ResendSuccess />}</div>;
};

const ResendButton: FC<{ state: LoginPageState }> = ({ state }) => (
  <button type="button" onClick={state.handleResend} disabled={state.resendStatus === "loading"} className="mt-2 text-xs font-semibold text-red-600 hover:underline block text-left">
    {state.resendStatus === "loading" ? "Mengirim..." : "Kirim ulang email verifikasi"}
  </button>
);

const ResendSuccess: FC = () => (
  <p className="text-green-600 dark:text-green-400 text-xs mt-1 font-medium flex items-center gap-1">
    <Check size={12} /> Email verifikasi baru berhasil dikirim. Silakan periksa inbox Anda.
  </p>
);
