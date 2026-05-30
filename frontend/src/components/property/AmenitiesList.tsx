import type { FC } from 'react';
import { AMENITIES_LIST } from '@/lib/amenities';

interface AmenitiesListProps {
  amenities?: string[];
  compact?: boolean;
}

const optionMap = new Map(AMENITIES_LIST.map((item) => [item.id, item]));

const getAmenity = (id: string) =>
  optionMap.get(id) || { id, label: id, icon: AMENITIES_LIST[0].icon };

export const AmenitiesList: FC<AmenitiesListProps> = ({ amenities, compact }) => {
  if (!amenities?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((id) => {
        const amenity = getAmenity(id);
        const Icon = amenity.icon;
        return (
          <span key={id} className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}>
            <Icon size={compact ? 13 : 15} />
            {amenity.label}
          </span>
        );
      })}
    </div>
  );
};
