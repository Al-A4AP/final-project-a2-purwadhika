import type { FC } from "react";

export const PeakSeasonHeader: FC = () => (
  <div className="flex flex-col gap-3">
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
      Harga Musiman
    </h1>
    <p className="max-w-3xl text-slate-600 dark:text-slate-400">
      Pusat pengelolaan harga peak season untuk seluruh properti dan tipe kamar milik Anda.
    </p>
  </div>
);
