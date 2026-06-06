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
      <div className="grid grid-cols-2 gap-4">
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
  <Link to={link} className={`flex items-center gap-3 lg:gap-4 rounded-3xl border p-4 shadow-sm transition-all hover:shadow-md ${colorStyles[color]}`}>
    <div className="shrink-0 p-1">
      <Icon className="h-7 w-7 opacity-90 lg:h-8 lg:w-8" />
    </div>
    <div className="flex min-w-0 flex-col text-left">
      <span className="mb-0.5 text-2xl font-black leading-none lg:text-3xl">{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-80 leading-tight lg:text-[11px]">{title}</span>
    </div>
  </Link>
);
