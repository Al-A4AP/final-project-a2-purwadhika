import type { FC } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Star, Settings } from "lucide-react";

export const DashboardQuickActions: FC = () => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <ActionCard title="Riwayat Booking" icon={ShoppingBag} link="/orders" color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <ActionCard title="Tersimpan" icon={Heart} link="/saved-properties" color="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" />
        <ActionCard title="Ulasan Saya" icon={Star} link="/reviews" color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <ActionCard title="Pengaturan Profil" icon={Settings} link="/profile" color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" />
      </div>
    </div>
  );
};

const ActionCard: FC<{ title: string; icon: React.ElementType; link: string; color: string }> = ({ title, icon: Icon, link, color }) => (
  <Link to={link} className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900/50">
    <div className={`mb-3 rounded-full p-4 ${color}`}>
      <Icon size={24} />
    </div>
    <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
  </Link>
);
