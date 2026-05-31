import type { FC } from "react";
import type { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import type { NavbarState } from "./navbarTypes";
import { ProfileDropdown } from "./ProfileDropdown";
import { UserAvatar } from "./UserAvatar";

interface DesktopProfileMenuProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  state: NavbarState;
}

export const DesktopProfileMenu: FC<DesktopProfileMenuProps> = ({ dropdownRef, state }) => (
  <div className="relative" ref={dropdownRef}>
    <button onClick={state.toggleProfile} className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none">
      <UserAvatar user={state.user} />
      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${state.profileOpen ? "rotate-180" : ""}`} />
    </button>
    {state.profileOpen && <ProfileDropdown state={state} />}
  </div>
);
