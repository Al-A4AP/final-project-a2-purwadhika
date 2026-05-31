import type { FC } from "react";
import { Sparkles } from "lucide-react";

export const HeroPremiumBadge: FC = () => (
  <span className="flex items-center gap-1.5 text-red-500 font-semibold text-xs md:text-sm tracking-wider uppercase bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-4 animate-fade-in-down border border-white/20">
    <Sparkles size={14} className="text-red-500 fill-red-500" />
    <span className="text-rose-600 font-bold">PURWA</span>
    <span className="text-slate-900 font-bold">LOKA</span>
    Premium Vacation Homes
  </span>
);
