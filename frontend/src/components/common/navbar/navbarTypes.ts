import type { User } from "@/types";

export interface NavbarState {
  closeMobile: () => void;
  closeProfile: () => void;
  handleLogout: () => Promise<void>;
  isAuthenticated: boolean;
  isOpen: boolean;
  profileOpen: boolean;
  profilePath: string;
  toggleMobile: () => void;
  toggleProfile: () => void;
  user: User | null;
}
