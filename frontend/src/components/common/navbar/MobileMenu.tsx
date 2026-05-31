import type { FC } from "react";
import type { NavbarState } from "./navbarTypes";
import { MobileAuthActions } from "./MobileAuthActions";
import { MobileNavLinks } from "./MobileNavLinks";
import { MobileUserActions } from "./MobileUserActions";
import { MobileUserHeader } from "./MobileUserHeader";

export const MobileMenu: FC<{ state: NavbarState }> = ({ state }) => {
  if (!state.isOpen) return null;
  return (
    <div className="md:hidden py-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
      {state.isAuthenticated && <MobileUserHeader user={state.user} />}
      <MobileNavLinks onNavigate={state.closeMobile} />
      {state.isAuthenticated ? <MobileUserActions state={state} /> : <MobileAuthActions onNavigate={state.closeMobile} />}
    </div>
  );
};
