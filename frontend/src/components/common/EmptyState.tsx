import type { FC, ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description?: string;
  title: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ action, className = "", description, title }) => (
  <div className={`rounded-2xl border border-dashed border-slate-200 bg-white/60 backdrop-blur-sm px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
    <Inbox className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={48} strokeWidth={1.5} />
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
