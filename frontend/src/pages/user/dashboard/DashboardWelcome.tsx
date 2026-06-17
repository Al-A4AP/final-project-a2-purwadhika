import type { FC } from "react";
import {
  DashboardAvatar,
  DashboardWelcomeCopy,
  type DashboardUserSummary,
} from "./DashboardWelcomeParts";

interface DashboardWelcomeProps {
  user: DashboardUserSummary | null;
}

export const DashboardWelcome: FC<DashboardWelcomeProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="mb-8 flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <DashboardAvatar user={user} />
      <DashboardWelcomeCopy user={user} />
    </div>
  );
};
