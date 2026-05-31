import type { FC } from "react";
import type { RefObject } from "react";
import ThemeToggle from "../ThemeToggle";
import type { NavbarState } from "./navbarTypes";
import { DesktopAuthActions } from "./DesktopAuthActions";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { DesktopProfileMenu } from "./DesktopProfileMenu";

interface DesktopMenuProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  state: NavbarState;
}

export const DesktopMenu: FC<DesktopMenuProps> = ({ dropdownRef, state }) => (
  <div className="hidden md:flex items-center space-x-8">
    <DesktopNavLinks />
    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
    <ThemeToggle />
    {state.isAuthenticated ? <DesktopProfileMenu dropdownRef={dropdownRef} state={state} /> : <DesktopAuthActions />}
  </div>
);
