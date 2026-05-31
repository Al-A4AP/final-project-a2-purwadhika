import type { FC } from "react";
import { TrendingUp } from "lucide-react";

export const PeakRatesHeader: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex justify-between items-center pb-3 border-b dark:border-slate-700">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
      <TrendingUp size={20} className="text-orange-500" />
      Kelola Peak Season
    </h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-bold text-lg">&times;</button>
  </div>
);
