import type { FC } from "react";
import type { RefObject } from "react";
import type { NavbarState } from "./navbarTypes";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenuButton } from "./MobileMenuButton";
import { NavbarBrand } from "./NavbarBrand";

interface NavbarBarProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  state: NavbarState;
}

export const NavbarBar: FC<NavbarBarProps> = ({ dropdownRef, state }) => (
  <div className="flex justify-between items-center h-20">
    <NavbarBrand />
    <DesktopMenu dropdownRef={dropdownRef} state={state} />
    <MobileMenuButton isOpen={state.isOpen} onToggle={state.toggleMobile} />
  </div>
);
