import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { getProfilePath } from "./navbarUtils";

export const useNavbarState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const closeMobile = useCallback(() => setIsOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useCloseProfileOnOutsideClick(dropdownRef, closeProfile);
  const handleLogout = useLogoutAction(logout, navigate, closeMobile, closeProfile);
  return { dropdownRef, state: { closeMobile, closeProfile, handleLogout, isAuthenticated, isOpen, profileOpen, profilePath: getProfilePath(user), toggleMobile: () => setIsOpen((open) => !open), toggleProfile: () => setProfileOpen((open) => !open), user } };
};

const useCloseProfileOnOutsideClick = (ref: React.RefObject<HTMLDivElement | null>, close: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close, ref]);
};

const useLogoutAction = (
  logout: () => Promise<void>,
  navigate: ReturnType<typeof useNavigate>,
  closeMobile: () => void,
  closeProfile: () => void,
) => useCallback(async () => {
  await logout();
  navigate("/auth/login", { replace: true });
  closeMobile();
  closeProfile();
}, [closeMobile, closeProfile, logout, navigate]);
