import type { FC } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "./navbarLinks";

const LINK_CLASS = "block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800";

export const MobileNavLinks: FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
  <div className="px-2 space-y-1">
    {NAV_LINKS.map((link) => <Link key={link.to} to={link.to} onClick={onNavigate} className={LINK_CLASS}>{link.label}</Link>)}
  </div>
);
