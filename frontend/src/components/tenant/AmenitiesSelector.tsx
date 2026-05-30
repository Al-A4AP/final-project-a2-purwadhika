import type { FC } from 'react';
import { AMENITIES_LIST } from '@/lib/amenities';

interface AmenitiesSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const getButtonClass = (selected: boolean) =>
  selected
    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:text-gray-300';

export const AmenitiesSelector: FC<AmenitiesSelectorProps> = ({ selected, onToggle }) => (
  <div className="grid grid-cols-2 gap-3">
    {AMENITIES_LIST.map((amenity) => {
      const Icon = amenity.icon;
      const active = selected.includes(amenity.id);
      return (
        <button
          key={amenity.id}
          type="button"
          onClick={() => onToggle(amenity.id)}
          className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition ${getButtonClass(active)}`}
        >
          <Icon size={16} />
          <span>{amenity.label}</span>
        </button>
      );
    })}
  </div>
);
