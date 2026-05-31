import type { FC } from "react";

export const PeakRatesFooter: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex justify-end pt-2 border-t dark:border-slate-700">
    <button onClick={onClose} className="bg-gray-150 hover:bg-gray-250 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white text-gray-800 px-4 py-2 rounded-lg font-medium transition text-xs">
      Tutup
    </button>
  </div>
);
