import type { FC } from "react";
import { TicketPercent } from "lucide-react";
import { formatVoucherBenefit } from "@/lib/voucherFormatters";
import { useUserVoucherSummary } from "@/hooks/user/dashboard/useUserVoucherSummary";
import type { Voucher } from "@/types";

export const DashboardVouchers: FC = () => {
  const summary = useUserVoucherSummary();
  if (!summary) return null;
  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <VoucherHeader />
      <VoucherList vouchers={summary.vouchers} />
    </div>
  );
};

const VoucherHeader: FC = () => (
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"><TicketPercent size={20} /></div>
    <div><h2 className="font-bold text-slate-900 dark:text-white">Voucher Saya</h2><p className="text-xs text-slate-500 dark:text-slate-400">Gunakan kode voucher saat reservasi.</p></div>
  </div>
);

const VoucherList: FC<{ vouchers: Voucher[] }> = ({ vouchers }) => (
  <div className="space-y-2">
    {vouchers.slice(0, 3).map((voucher) => <VoucherRow key={voucher.id} voucher={voucher} />)}
    {!vouchers.length && <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada voucher aktif.</p>}
  </div>
);

const VoucherRow: FC<{ voucher: Voucher }> = ({ voucher }) => (
  <div className="rounded-xl border border-dashed border-amber-200 p-3 text-sm dark:border-amber-900/50">
    <p className="font-bold text-slate-900 dark:text-white">{voucher.code}</p>
    <p className="text-slate-500 dark:text-slate-400">{formatVoucherBenefit(voucher)} sampai {new Date(voucher.expires_at).toLocaleDateString("id-ID")}</p>
  </div>
);
