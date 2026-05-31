import type { FC } from "react";

type ActiveCityNoticeProps = {
  activeCity?: string;
  onClearCity?: () => void;
};

export const ActiveCityNotice: FC<ActiveCityNoticeProps> = ({ activeCity, onClearCity }) =>
  activeCity ? (
    <div className="mb-6 p-4 bg-rose-50 dark:bg-slate-800/40 rounded-lg border border-rose-200 dark:border-slate-700 flex items-center justify-between">
      <span className="text-sm text-rose-700 dark:text-rose-300 font-serif tracking-wide"><strong>Lokasi:</strong> {activeCity}</span>
      <button onClick={onClearCity} className="px-4 py-1.5 bg-rose-600 dark:bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors tracking-wide">Hapus Lokasi</button>
    </div>
  ) : null;
