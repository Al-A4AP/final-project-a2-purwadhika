import type { FC } from "react";
import { Copy, TicketPercent } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/formatters";
import { useUserVoucherSummary } from "@/hooks/user/dashboard/useUserVoucherSummary";
import type { Voucher } from "@/types";

export const DashboardVoucherReferral: FC = () => {
  const summary = useUserVoucherSummary();
  if (!summary) return null;
  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <VoucherHeader />
      <ReferralCode code={summary.referralCode} />
      <VoucherList vouchers={summary.vouchers} />
    </div>
  );
};

const VoucherHeader: FC = () => (
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"><TicketPercent size={20} /></div>
    <div><h2 className="font-bold text-slate-900 dark:text-white">Voucher & Referral</h2><p className="text-xs text-slate-500 dark:text-slate-400">Gunakan kode saat reservasi.</p></div>
  </div>
);

const ReferralCode: FC<{ code: string | null }> = ({ code }) => (
  <button type="button" onClick={() => copyReferralCode(code)} className="mb-4 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-left dark:bg-slate-800">
    <span><span className="block text-xs font-semibold uppercase text-slate-500">Kode Referal Saya</span><span className="font-bold text-slate-900 dark:text-white">{code || "-"}</span></span>
    <Copy size={17} className="text-slate-400" />
  </button>
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
    <p className="text-slate-500 dark:text-slate-400">{formatDiscount(voucher)} sampai {new Date(voucher.expires_at).toLocaleDateString("id-ID")}</p>
  </div>
);

const copyReferralCode = (code: string | null) => {
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => toast.success("Kode referal disalin"));
};

const formatDiscount = (voucher: Voucher) =>
  voucher.discount_type === "PERCENTAGE" ? `Diskon ${voucher.discount_value}%` : `Diskon ${formatPrice(voucher.discount_value)}`;
