import type { FC } from "react";
import { TicketPercent, X } from "lucide-react";
import { formatVoucherBenefit } from "@/lib/voucherFormatters";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const VoucherCodeBox: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-900/10">
    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
      <TicketPercent size={18} /> Kode Voucher
    </div>
    <div className="flex flex-col gap-3 sm:flex-row">
      <input value={state.voucherCode} onChange={(event) => state.setVoucherCode(event.target.value)} placeholder="Masukkan kode voucher" className="h-11 flex-1 rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold uppercase outline-none focus:border-amber-400 dark:border-amber-800 dark:bg-slate-900 dark:text-white" />
      <button type="button" onClick={state.applyVoucher} disabled={state.voucherLoading} className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{state.voucherLoading ? "Mengecek..." : "Terapkan"}</button>
    </div>
    {state.voucherPreview && <VoucherAppliedNotice state={state} />}
  </div>
);

const VoucherAppliedNotice: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900">
    <span className="text-slate-600 dark:text-slate-300">{formatVoucherBenefit(state.voucherPreview!.voucher)} diterapkan.</span>
    <button type="button" onClick={state.clearVoucher} className="text-slate-400 hover:text-red-500" title="Hapus voucher" aria-label="Hapus voucher"><X size={16} /></button>
  </div>
);
