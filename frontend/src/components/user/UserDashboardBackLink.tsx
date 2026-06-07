import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const UserDashboardBackLink: FC = () => (
  <Link
    to="/dashboard"
    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
  >
    <ArrowLeft size={16} />
    Kembali ke Dashboard
  </Link>
);
