import type { FC } from "react";
import { Link } from "react-router-dom";

export const NavbarBrand: FC = () => (
  <Link to="/" className="text-2xl tracking-widest">
    <span className="text-rose-600 font-bold">PURWA</span><span className="text-slate-900 dark:text-white font-bold">LOKA</span>
  </Link>
);
