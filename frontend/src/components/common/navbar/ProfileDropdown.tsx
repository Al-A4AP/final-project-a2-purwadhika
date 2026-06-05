import type { FC } from "react";
import { LayoutDashboard, LogOut, ShoppingBag, User, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavbarState } from "./navbarTypes";

const LINK_CLASS = "flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition";

export const ProfileDropdown: FC<{ state: NavbarState }> = ({ state }) => (
  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in origin-top-right">
    <ProfileDropdownHeader state={state} />
    <div className="py-2"><ProfileDropdownLinks state={state} /></div>
    <div className="border-t border-slate-50 dark:border-slate-800 pt-2 pb-1"><LogoutButton onLogout={state.handleLogout} /></div>
  </div>
);

const ProfileDropdownHeader: FC<{ state: NavbarState }> = ({ state }) => (
  <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800"><p className="text-sm font-bold text-slate-900 dark:text-white truncate">{state.user?.name}</p><p className="text-xs text-slate-500 truncate mt-0.5">{state.user?.email}</p></div>
);

const ProfileDropdownLinks: FC<{ state: NavbarState }> = ({ state }) => (
  <>
    {state.user?.role === "USER" && (
      <>
        <Link to="/dashboard" className={LINK_CLASS} onClick={state.closeProfile}>
          <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
        </Link>
        <Link to="/orders" className={LINK_CLASS} onClick={state.closeProfile}>
          <ShoppingBag size={16} className="text-slate-400" /> Riwayat Pemesanan
        </Link>
        <Link to="/saved-properties" className={LINK_CLASS} onClick={state.closeProfile}>
          <Heart size={16} className="text-slate-400" /> Tersimpan
        </Link>
        <Link to="/reviews" className={LINK_CLASS} onClick={state.closeProfile}>
          <MessageSquare size={16} className="text-slate-400" /> Ulasan Saya
        </Link>
      </>
    )}
    <Link to={state.profilePath} className={LINK_CLASS} onClick={state.closeProfile}>
      <User size={16} className="text-slate-400" /> Profil Saya
    </Link>
    {state.user?.role === "TENANT" && (
      <Link to="/tenant/dashboard" className={LINK_CLASS} onClick={state.closeProfile}>
        <LayoutDashboard size={16} className="text-slate-400" /> Dashboard Tenant
      </Link>
    )}
  </>
);

export const LogoutButton: FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition"><LogOut size={16} /> Logout</button>
);
