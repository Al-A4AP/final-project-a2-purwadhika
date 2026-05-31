import type { FC } from "react";
import { Link } from "react-router-dom";

export const MobileAuthActions: FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
  <div className="px-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
    <Link to="/auth/login" onClick={onNavigate} className="text-center py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">Masuk</Link>
    <Link to="/auth/register" onClick={onNavigate} className="text-center py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-sm">Daftar</Link>
  </div>
);
