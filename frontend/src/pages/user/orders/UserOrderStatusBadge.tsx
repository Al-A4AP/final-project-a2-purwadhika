import type { FC, ReactNode } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const badgeClass = "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium";

const BADGES: Record<string, ReactNode> = {
  WAITING_PAYMENT: <span className={`${badgeClass} text-yellow-600 bg-yellow-50`}><Clock size={14} /> Menunggu Pembayaran</span>,
  WAITING_CONFIRMATION: <span className={`${badgeClass} text-blue-600 bg-blue-50`}><Clock size={14} /> Menunggu Konfirmasi</span>,
  PROCESSED: <span className={`${badgeClass} text-green-600 bg-green-50`}><CheckCircle2 size={14} /> Dikonfirmasi</span>,
  COMPLETED: <span className={`${badgeClass} text-emerald-600 bg-emerald-50`}><CheckCircle2 size={14} /> Selesai Menginap</span>,
  CANCELLED: <span className={`${badgeClass} text-red-600 bg-red-50`}><XCircle size={14} /> Dibatalkan</span>,
};

export const UserOrderStatusBadge: FC<{ status: string }> = ({ status }) => <>{BADGES[status] || null}</>;
