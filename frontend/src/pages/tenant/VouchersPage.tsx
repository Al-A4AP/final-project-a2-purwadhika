import type { FC } from "react";
import { TicketPercent } from "lucide-react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useTenantVouchersPage } from "@/hooks/tenant/vouchers/useTenantVouchersPage";
import { TenantVoucherForm } from "./vouchers/TenantVoucherForm";
import { TenantVoucherList } from "./vouchers/TenantVoucherList";

const VouchersPage: FC = () => {
  const state = useTenantVouchersPage();
  if (state.loading) return <SectionLoading className="mx-auto max-w-7xl px-4 py-12" label="Memuat voucher..." variant="cards" />;
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 pb-24 dark:bg-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <VouchersHeader />
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <TenantVoucherForm state={state} />
          <TenantVoucherList state={state} />
        </div>
      </div>
    </div>
  );
};

const VouchersHeader: FC = () => (
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
      <TicketPercent size={22} />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voucher</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Kelola kode promo yang bisa dipakai pelanggan saat reservasi.</p>
    </div>
  </div>
);

export default VouchersPage;
