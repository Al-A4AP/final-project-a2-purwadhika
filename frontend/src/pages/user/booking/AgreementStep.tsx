import type { FC } from "react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

const agreementItems = [
  { title: "Tanggal dan kamar sudah sesuai", text: "Saya sudah memeriksa properti, kamar, tanggal check-in, dan tanggal check-out." },
  { title: "Data tamu benar", text: "Data tamu yang saya isi dapat digunakan untuk kebutuhan reservasi dan verifikasi." },
  { title: "Kebijakan pembayaran dipahami", text: "Pesanan menunggu pembayaran dapat otomatis dibatalkan jika tidak diselesaikan tepat waktu." },
];

export const AgreementStep: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
    {agreementItems.map((item) => <AgreementItem key={item.title} {...item} />)}
    <AgreementCheckbox state={state} />
  </div>
);

const AgreementCheckbox: FC<{ state: BookingPageState }> = ({ state }) => (
  <label className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm dark:bg-slate-900">
    <input type="checkbox" checked={state.agreementAccepted} onChange={(event) => state.setAgreementAccepted(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900" />
    <span className="font-semibold text-slate-800 dark:text-slate-100">Saya menyetujui detail reservasi dan kebijakan yang berlaku.</span>
  </label>
);

const AgreementItem: FC<{ text: string; title: string }> = ({ text, title }) => (
  <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
    <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);
