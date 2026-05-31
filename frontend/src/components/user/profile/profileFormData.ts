import type { ProfileInput } from "@/validations/profile";

export const compactProfileData = (data: ProfileInput) =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ""));
