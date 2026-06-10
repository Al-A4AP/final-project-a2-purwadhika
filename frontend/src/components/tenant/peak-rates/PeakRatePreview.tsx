import type { FC } from "react";
import { formatCurrency } from "@/lib/formatters";

interface PeakRatePreviewProps {
  basePrice: number;
  rateType: "PERCENTAGE" | "NOMINAL";
  rateValue: string;
}

export const PeakRatePreview: FC<PeakRatePreviewProps> = ({ basePrice, rateType, rateValue }) => {
  const numericValue = Number(rateValue) || 0;
  
  const addedValue = rateType === "PERCENTAGE" 
    ? Math.floor(basePrice * (numericValue / 100))
    : numericValue;
    
  const finalPrice = basePrice + addedValue;

  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-700 mt-2">
      <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
        Live Price Preview
      </h4>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">Harga Dasar</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(basePrice)}</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-1">
        <span className="text-slate-600 dark:text-slate-400">Penyesuaian</span>
        <span className="font-medium text-orange-600 dark:text-orange-500">+{formatCurrency(addedValue)}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Harga Akhir Kamar</span>
        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-500">{formatCurrency(finalPrice)}</span>
      </div>
    </div>
  );
};
