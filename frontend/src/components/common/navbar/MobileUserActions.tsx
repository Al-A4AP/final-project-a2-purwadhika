import type { FC } from "react";
import { LayoutDashboard, LogOut, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavbarState } from "./navbarTypes";

const LINK_CLASS = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800";

export const MobileUserActions: FC<{ state: NavbarState }> = ({ state }) => (
  <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
    <Link to={state.profilePath} onClick={state.closeMobile} className={LINK_CLASS}><User size={18} className="text-slate-400" /> Profil Saya</Link>
    {state.user?.role === "USER" && <Link to="/orders" onClick={state.closeMobile} className={LINK_CLASS}><ShoppingBag size={18} className="text-slate-400" /> Pesanan Saya</Link>}
    {state.user?.role === "TENANT" && <Link to="/tenant/dashboard" onClick={state.closeMobile} className={LINK_CLASS}><LayoutDashboard size={18} className="text-slate-400" /> Dashboard Tenant</Link>}
    <MobileLogoutButton onLogout={state.handleLogout} />
  </div>
);

const MobileLogoutButton: FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
    <LogOut size={18} /> Logout
  </button>
);
