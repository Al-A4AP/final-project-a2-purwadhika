import type { FC } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  className?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
}

export const ErrorState: FC<ErrorStateProps> = ({ className = "", message, onRetry, retryLabel = "Coba Lagi", title = "Data belum bisa dimuat" }) => (
  <div className={`rounded-xl border bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800 ${className}`}>
    <AlertCircle className="mx-auto mb-4 text-red-500" size={44} />
    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{message}</p>
    {onRetry && <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"><RefreshCw size={16} />{retryLabel}</button>}
  </div>
);
