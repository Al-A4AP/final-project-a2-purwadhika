import type { FC } from "react";
import type { User } from "@/types";

export const CurrentEmailBox: FC<{ user: User | null }> = ({ user }) => (
  <div className="mb-4 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900/50">
    <p className="text-gray-600 dark:text-gray-400">Email saat ini</p>
    <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
    {user?.pending_email && <p className="mt-2 text-amber-600 dark:text-amber-400">Menunggu verifikasi: {user.pending_email}</p>}
  </div>
);
