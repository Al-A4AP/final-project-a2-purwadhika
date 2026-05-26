import type { FC } from 'react';

interface GuestType { key: 'adults' | 'children' | 'babies'; label: string; desc: string }

const GUEST_TYPES: GuestType[] = [
  { key: 'adults', label: 'Dewasa', desc: 'Usia 13 tahun ke atas' },
  { key: 'children', label: 'Anak-anak', desc: 'Usia 2 - 12 tahun' },
  { key: 'babies', label: 'Bayi', desc: 'Di bawah 2 tahun' },
];

interface Props {
  guests: { adults: number; children: number; babies: number };
  roomCapacity: number;
  onUpdate: (type: 'adults' | 'children' | 'babies', delta: number) => void;
}

export const GuestCounter: FC<Props> = ({ guests, roomCapacity, onUpdate }) => {
  const totalGuests = guests.adults + guests.children;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Tamu</h2>
      <div className="space-y-4">
        {GUEST_TYPES.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onUpdate(key, -1)}
                className="w-8 h-8 rounded-full border dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition"
                disabled={guests[key] <= (key === 'adults' ? 1 : 0)}>−</button>
              <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">{guests[key]}</span>
              <button type="button" onClick={() => onUpdate(key, 1)}
                className="w-8 h-8 rounded-full border dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition"
                disabled={
                  (key === 'adults' && guests.adults >= roomCapacity) ||
                  (key === 'children' && guests.children >= guests.adults) ||
                  (key === 'babies' && guests.babies >= guests.adults)
                }>+</button>
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-400 border-t dark:border-slate-700 pt-3 flex flex-col sm:flex-row justify-between gap-2">
          <span>Total tamu: <strong>{totalGuests} orang</strong>{guests.babies > 0 ? ` + ${guests.babies} bayi` : ''}</span>
          <span className="text-gray-500">Kapasitas kamar: <strong>{roomCapacity} Dewasa</strong> (Maks. Anak & Bayi sesuai jumlah Dewasa)</span>
        </div>
      </div>
    </div>
  );
};
