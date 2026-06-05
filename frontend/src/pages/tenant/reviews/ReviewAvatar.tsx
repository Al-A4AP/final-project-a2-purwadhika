import type { FC } from "react";
import { User } from "lucide-react";
import type { Review } from "@/types";

export const ReviewAvatar: FC<{ user?: Review["user"] }> = ({ user }) => (
  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
    {user?.avatar_url
      ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
      : <User size={22} className="text-slate-400" />
    }
  </div>
);
