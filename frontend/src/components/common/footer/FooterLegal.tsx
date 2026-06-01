import type { FC } from "react";
import { Link } from "react-router-dom";
import { LEGAL_LINKS } from "./footerLinks";

export const FooterLegal: FC = () => (
  <div className="flex flex-col items-center justify-between text-sm md:flex-row">
    <p>&copy; 2026 PURWALOKA. All rights reserved.</p>
    <div className="mt-4 flex gap-4 md:mt-0">
      {LEGAL_LINKS.map((link) => <Link key={link.to} to={link.to} className="transition hover:text-white">{link.label}</Link>)}
    </div>
  </div>
);
