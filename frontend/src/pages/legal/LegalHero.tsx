import type { FC } from "react";
import { LEGAL_UPDATED_AT } from "./legalData";

export const LegalHero: FC = () => (
  <section className="bg-slate-950 px-4 py-20 text-white">
    <div className="mx-auto max-w-5xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-300">Kebijakan Layanan</p>
      <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Privacy Policy dan Terms of Service</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">Satu halaman ringkas untuk memahami penggunaan data, aturan pemesanan, pembayaran, dan tanggung jawab tenant di PURWALOKA.</p>
      <p className="mt-4 text-sm text-slate-400">Terakhir diperbarui: {LEGAL_UPDATED_AT}</p>
    </div>
  </section>
);
