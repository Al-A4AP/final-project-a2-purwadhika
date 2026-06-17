import type { FC } from "react";
import { Link } from "react-router-dom";
import { Heart, Settings, ShoppingBag, Star, type LucideIcon } from "lucide-react";

export const DashboardQuickActions: FC = () => (
  <div className="mb-8">
    <h2 className="mb-4 mt-4 text-xl font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
    <div className="grid grid-cols-2 gap-4">
      {ACTIONS.map((action) => <ActionCard key={action.link} {...action} />)}
    </div>
  </div>
);

const ActionCard: FC<ActionItem> = ({ title, icon: Icon, link, color }) => (
  <Link to={link} className="flex items-center gap-3 lg:gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900/50">
    <div className={`shrink-0 rounded-full p-2.5 lg:p-3 ${color}`}>
      <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
    </div>
    <span className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white text-left leading-tight">{title}</span>
  </Link>
);

interface ActionItem {
  color: string;
  icon: LucideIcon;
  link: string;
  title: string;
}

const ACTIONS: ActionItem[] = [
  { title: "Riwayat Booking", icon: ShoppingBag, link: "/orders", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "Tersimpan", icon: Heart, link: "/saved-properties", color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  { title: "Ulasan Saya", icon: Star, link: "/reviews", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { title: "Pengaturan Profil", icon: Settings, link: "/profile", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
];
