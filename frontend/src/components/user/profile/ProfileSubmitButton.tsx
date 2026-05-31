import type { FC, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProfileSubmitButtonProps {
  children: ReactNode;
  loadingLabel: string;
  variant?: "primary" | "dark";
  isSubmitting: boolean;
}

const variantClass = (variant: "primary" | "dark") =>
  variant === "primary" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600";

export const ProfileSubmitButton: FC<ProfileSubmitButtonProps> = ({ children, isSubmitting, loadingLabel, variant = "dark" }) => (
  <button type="submit" disabled={isSubmitting} className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-semibold text-white transition disabled:opacity-60 ${variantClass(variant)}`}>
    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> {loadingLabel}</> : children}
  </button>
);
