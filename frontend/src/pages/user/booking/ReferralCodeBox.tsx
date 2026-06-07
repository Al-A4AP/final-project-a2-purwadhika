import { Gift, X } from "lucide-react";
import type { FC } from "react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const ReferralCodeBox: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
      <Gift size={16} />
      Kode Referral
    </div>
    <div className="flex gap-2">
      <input value={state.referralCode} onChange={(event) => state.setReferralCode(event.target.value)} placeholder="Masukkan kode referral" className="h-11 flex-1 rounded-xl border border-rose-200 bg-white px-3 text-sm font-semibold uppercase outline-none focus:border-rose-400 dark:border-rose-800 dark:bg-slate-900 dark:text-white" />
      <button type="button" onClick={state.clearReferralCode} className="rounded-xl border border-rose-200 px-3 text-rose-500 hover:bg-white dark:border-rose-800 dark:hover:bg-slate-900" title="Hapus kode referral" aria-label="Hapus kode referral">
        <X size={16} />
      </button>
    </div>
    <p className="mt-2 text-xs text-rose-700/80 dark:text-rose-200/80">Pemilik kode mendapat reward setelah reservasi Anda dikonfirmasi.</p>
  </div>
);
