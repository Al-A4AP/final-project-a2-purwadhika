import type { FC } from "react";
import SearchForm from "../SearchForm";

export const HeroSearchPanel: FC = () => (
  <div className="relative -mt-20 md:-mt-24 z-40 max-w-7xl mx-auto px-4">
    <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl p-2.5 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-750/30">
      <SearchForm />
    </div>
  </div>
);
