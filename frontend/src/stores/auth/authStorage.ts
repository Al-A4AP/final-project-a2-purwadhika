import { STORAGE_KEYS } from "@/lib/constants";

export const clearStoredUser = () => localStorage.removeItem(STORAGE_KEYS.USER);
