import type { FC } from "react";
import { User } from "lucide-react";
import type { Review } from "@/types";

export const ReviewAvatar: FC<{ user?: Review["user"] }> = ({ user }) => (
  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">{user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <User size={24} className="text-gray-500" />}</div>
);
