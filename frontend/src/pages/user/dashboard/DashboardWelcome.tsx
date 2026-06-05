import type { FC } from "react";
import { User, ShieldCheck } from "lucide-react";

interface DashboardWelcomeProps {
  user: { name: string; avatar_url?: string } | null;
}

export const DashboardWelcome: FC<DashboardWelcomeProps> = ({ user }) => {
  if (!user) return null;
  return (
    <div className="mb-8 flex items-center gap-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <User size={40} className="text-slate-400" />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Selamat Datang, {user.name}!</h1>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
          <ShieldCheck size={16} />
          <span>Member Verified</span>
        </div>
      </div>
    </div>
  );
};
