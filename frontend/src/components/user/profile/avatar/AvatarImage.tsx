import type { FC } from "react";
import { User as UserIcon } from "lucide-react";
import type { User } from "@/types";

export const AvatarImage: FC<{ user: User | null }> = ({ user }) => (
  user?.avatar_url ? (
    <img src={user.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
  ) : (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
      <UserIcon size={32} className="text-red-600" />
    </div>
  )
);
