import type { FC } from "react";
import { AlertTriangle } from "lucide-react";

export const DateErrorNotice: FC<{ message: string }> = ({ message }) =>
  message ? (
    <p className="mt-4 text-sm text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
      <AlertTriangle size={16} /> {message}
    </p>
  ) : null;
