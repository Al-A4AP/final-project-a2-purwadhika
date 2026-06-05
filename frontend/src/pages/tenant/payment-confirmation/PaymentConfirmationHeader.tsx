import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const PaymentConfirmationHeader = () => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Konfirmasi Pembayaran</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Tinjau bukti transfer manual dan proses pesanan yang menunggu persetujuan Anda.</p>
    </div>
    <Link to="/tenant/orders" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
      <ChevronLeft size={16} /> Kembali ke Reservasi
    </Link>
  </div>
);

