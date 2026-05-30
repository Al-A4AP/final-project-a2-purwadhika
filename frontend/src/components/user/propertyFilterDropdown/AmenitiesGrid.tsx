import type { FC } from 'react';
import { AMENITIES_LIST } from './constants';
import type { AmenityOption } from './types';

interface AmenitiesGridProps {
  selectedAmenities: string[];
  onToggle: (id: string) => void;
}

const getAmenityClass = (isSelected: boolean) =>
  isSelected ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950';

const AmenityButton: FC<{ amenity: AmenityOption; isSelected: boolean; onToggle: (id: string) => void }> = ({ amenity, isSelected, onToggle }) => {
  const Icon = amenity.icon;
  return <button onClick={() => onToggle(amenity.id)} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${getAmenityClass(isSelected)}`}><Icon size={14} className="opacity-70" /><span>{amenity.label}</span></button>;
};

export const AmenitiesGrid: FC<AmenitiesGridProps> = ({ selectedAmenities, onToggle }) => (
  <section>
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fasilitas</h4>
    <div className="grid grid-cols-2 gap-2">
      {AMENITIES_LIST.map((amenity) => <AmenityButton key={amenity.id} amenity={amenity} isSelected={selectedAmenities.includes(amenity.id)} onToggle={onToggle} />)}
    </div>
  </section>
);
