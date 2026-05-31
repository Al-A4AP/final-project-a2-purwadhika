import type { FC, ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description?: string;
  title: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ action, className = "", description, title }) => (
  <div className={`rounded-xl border border-dashed bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800 ${className}`}>
    <Inbox className="mx-auto mb-4 text-gray-300 dark:text-slate-600" size={44} />
    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
