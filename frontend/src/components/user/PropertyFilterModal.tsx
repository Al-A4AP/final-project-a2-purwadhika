import type { FC } from 'react';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFilterStore } from '@/stores/filterStore';
import { AMENITIES_LIST } from '@/lib/amenities';

interface PropertyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const readPrice = (value: string) => (value === '' ? '' : Math.max(0, Number(value)));
const priceValue = (value: number | '') => (value === '' ? undefined : Math.max(0, Number(value)));

export const PropertyFilterModal: FC<PropertyFilterModalProps> = ({ isOpen, onClose }) => {
  const filters = useFilterStore();
  
  // Local state for the modal form so it doesn't trigger fetch on every keystroke
  const [minPrice, setMinPrice] = useState<number | ''>(filters.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState<number | ''>(filters.max_price ?? '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  const handleApply = () => {
    filters.setMinPrice(priceValue(minPrice));
    filters.setMaxPrice(priceValue(maxPrice));
    filters.setAmenities(selectedAmenities);
    filters.applyFilters();
    onClose();
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    filters.setMinPrice(undefined);
    filters.setMaxPrice(undefined);
    filters.setAmenities([]);
    filters.applyFilters();
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Pencarian" maxWidth="md">
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Rentang Harga (Per Malam)</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Harga Minimum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(readPrice(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Harga Maksimum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Tak terbatas"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(readPrice(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fasilitas</h4>
          <div className="grid grid-cols-2 gap-3">
            {AMENITIES_LIST.map(amenity => {
              const isSelected = selectedAmenities.includes(amenity.id);
              const Icon = amenity.icon;
              return (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                    isSelected 
                      ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' 
                      : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <Icon size={16} />
                  <span>{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
          >
            Hapus Semua
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </Modal>
  );
};
