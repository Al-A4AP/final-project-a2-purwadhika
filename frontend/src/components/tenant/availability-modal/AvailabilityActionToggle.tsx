import type { FC } from "react";

interface AvailabilityActionToggleProps {
  isAvailable: boolean;
  onChange: (value: boolean) => void;
}

export const AvailabilityActionToggle: FC<AvailabilityActionToggleProps> = ({ isAvailable, onChange }) => (
  <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 dark:bg-slate-900">
    <ActionButton active={!isAvailable} label="Tidak Tersedia" onClick={() => onChange(false)} />
    <ActionButton active={isAvailable} label="Tersedia" onClick={() => onChange(true)} />
  </div>
);

const ActionButton: FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button type="button" onClick={onClick} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-slate-800"}`}>{label}</button>
);
