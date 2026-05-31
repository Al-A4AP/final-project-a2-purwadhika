import type { FC } from "react";
import type { User } from "@/types";
import { getInitials } from "./navbarUtils";

interface UserAvatarProps {
  size?: "sm" | "md";
  user?: User | null;
}

export const UserAvatar: FC<UserAvatarProps> = ({ size = "sm", user }) => {
  const sizeClass = size === "md" ? "w-12 h-12 text-lg" : "w-10 h-10 text-sm";
  if (user?.avatar_url) return <img src={user.avatar_url} alt="Profile" className={`${sizeClass} rounded-full object-cover border border-slate-200 dark:border-slate-700`} />;
  return <div className={`${sizeClass} rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm`}>{getInitials(user?.name)}</div>;
};
