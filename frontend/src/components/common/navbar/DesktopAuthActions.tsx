import type { FC } from "react";
import { Link } from "react-router-dom";

export const DesktopAuthActions: FC = () => (
  <div className="flex items-center gap-4">
    <Link to="/auth/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition">Masuk</Link>
    <Link to="/auth/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-sm">Daftar</Link>
  </div>
);
