import type { User } from "@/types";

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.split(" ").map((item) => item[0]).join("").substring(0, 2).toUpperCase();
};

export const getProfilePath = (user?: User | null) =>
  user?.role === "TENANT" ? "/tenant/profile" : "/profile";
