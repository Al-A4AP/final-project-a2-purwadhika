import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";

export const PaymentConfirmationEmpty = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Tidak ada pembayaran tertunda" description="Saat ini tidak ada reservasi yang menunggu konfirmasi manual." action={<EmptyAction />} />
  </div>
);

const EmptyAction = () => (
  <Link to="/tenant/orders" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
    Lihat Semua Reservasi
  </Link>
);

