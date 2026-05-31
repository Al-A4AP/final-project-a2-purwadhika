import type { FC } from "react";
import { Loader2, Mail } from "lucide-react";

export const ForgotPasswordSubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
    {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
  </button>
);
