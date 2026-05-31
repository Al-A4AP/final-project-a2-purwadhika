import type { User } from "@/types";

const allowedAvatarTypes = ["image/jpeg", "image/png", "image/gif"];
const maxAvatarSize = 1024 * 1024;

export const isValidAvatar = (file: File) =>
  allowedAvatarTypes.includes(file.type) && file.size <= maxAvatarSize;

export const canChangePassword = (user: User | null) =>
  user?.auth_provider !== "GOOGLE" && !!user?.password_set_at;
