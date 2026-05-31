import type { FC } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "./navbarLinks";

const LINK_CLASS = "text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition";

export const DesktopNavLinks: FC = () => (
  <>
    {NAV_LINKS.map((link) => <Link key={link.to} to={link.to} className={LINK_CLASS}>{link.label}</Link>)}
  </>
);
