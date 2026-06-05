import type { FC } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, CreditCard, CalendarCheck } from "lucide-react";

interface DashboardActiveSummaryProps {
  stats: {
    waitingPayment: number;
    waitingConfirmation: number;
    confirmed: number;
    completed: number;
  };
}

export const DashboardActiveSummary: FC<DashboardActiveSummaryProps> = ({ stats }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Status Reservasi</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatusCard title="Menunggu Pembayaran" count={stats.waitingPayment} icon={CreditCard} color="amber" link="/orders?status=WAITING_PAYMENT" />
        <StatusCard title="Menunggu Konfirmasi" count={stats.waitingConfirmation} icon={Clock} color="blue" link="/orders?status=WAITING_CONFIRMATION" />
        <StatusCard title="Terkonfirmasi" count={stats.confirmed} icon={CalendarCheck} color="green" link="/orders?status=PROCESSED" />
        <StatusCard title="Selesai" count={stats.completed} icon={CheckCircle} color="slate" link="/orders?status=COMPLETED" />
      </div>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: "amber" | "blue" | "green" | "slate";
  link: string;
}

const colorStyles = {
  amber: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400 dark:bg-amber-900/10 dark:border-amber-900/50 dark:hover:border-amber-700",
  blue: "bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400 dark:bg-blue-900/10 dark:border-blue-900/50 dark:hover:border-blue-700",
  green: "bg-green-50 text-green-600 border-green-200 hover:border-green-400 dark:bg-green-900/10 dark:border-green-900/50 dark:hover:border-green-700",
  slate: "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500",
};

const StatusCard: FC<StatusCardProps> = ({ title, count, icon: Icon, color, link }) => (
  <Link to={link} className={`flex flex-col items-center justify-center rounded-3xl border p-6 text-center shadow-sm transition-all hover:shadow-md ${colorStyles[color]}`}>
    <Icon size={28} className="mb-3" />
    <span className="text-3xl font-black mb-1">{count}</span>
    <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{title}</span>
  </Link>
);
