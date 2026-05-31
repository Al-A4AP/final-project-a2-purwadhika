import type { FC } from "react";
import type { User } from "@/types";
import { UserAvatar } from "./UserAvatar";

export const MobileUserHeader: FC<{ user: User | null }> = ({ user }) => (
  <div className="px-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
    <UserAvatar user={user} size="md" />
    <div><p className="font-bold text-slate-900 dark:text-white">{user?.name}</p><p className="text-xs text-slate-500">{user?.email}</p></div>
  </div>
);
