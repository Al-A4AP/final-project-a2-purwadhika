import type { FC } from "react";
import { MobileMenu } from "./navbar/MobileMenu";
import { NavbarBar } from "./navbar/NavbarBar";
import { useNavbarState } from "./navbar/useNavbarState";

const Navbar: FC = () => {
  const { dropdownRef, state } = useNavbarState();
  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavbarBar dropdownRef={dropdownRef} state={state} />
        <MobileMenu state={state} />
      </div>
    </nav>
  );
};

export default Navbar;
