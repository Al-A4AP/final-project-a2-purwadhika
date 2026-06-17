import type { FC } from "react";
import { ShieldCheck, User } from "lucide-react";

export interface DashboardUserSummary {
  name: string;
  avatar_url?: string;
}

export const DashboardAvatar: FC<{ user: DashboardUserSummary }> = ({
  user,
}) => (
  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
    {user.avatar_url ? (
      <img
        src={user.avatar_url}
        alt={user.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <User size={40} className="text-slate-400" />
    )}
  </div>
);

export const DashboardWelcomeCopy: FC<{ user: DashboardUserSummary }> = ({
  user,
}) => (
  <div>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
      Selamat Datang, {user.name}!
    </h1>
    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
      <ShieldCheck size={16} />
      <span>Member Verified</span>
    </div>
  </div>
);
