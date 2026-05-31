import type { FC } from "react";
import type { User } from "@/types";

const roleLabel = (user: User | null) => user?.role === "TENANT" ? "Pemilik Properti" : "Penyewa";

export const AvatarUserInfo: FC<{ user: User | null }> = ({ user }) => (
  <div>
    <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
    <p className="text-sm text-gray-500">{user?.email}</p>
    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/20">{roleLabel(user)}</span>
  </div>
);
