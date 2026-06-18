import type { FC, ReactNode } from "react";
import { Banknote, BedDouble, Users } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

export const RoomsSummaryCards: FC<{ averagePrice: number; maxCapacity: number; totalRooms: number }> = (props) => (
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
    <SummaryCard icon={<BedDouble size={24} />} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" label="Total Tipe Kamar" value={String(props.totalRooms)} />
    <SummaryCard icon={<Banknote size={24} />} iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" label="Rata-rata Harga" value={props.totalRooms ? formatPrice(props.averagePrice) : "-"} />
    <SummaryCard icon={<Users size={24} />} iconClass="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" label="Kapasitas Maksimal" value={props.totalRooms ? `${props.maxCapacity} Orang` : "-"} />
  </div>
);

const SummaryCard: FC<{ icon: ReactNode; iconClass: string; label: string; value: string }> = (props) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-full ${props.iconClass}`}>{props.icon}</div><div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{props.label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{props.value}</p></div></div>
  </div>
);
