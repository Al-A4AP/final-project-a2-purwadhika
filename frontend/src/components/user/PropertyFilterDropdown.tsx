import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { Wifi, Car, Coffee, Tv, Monitor, Utensils, Waves, Dumbbell, SlidersHorizontal, ChevronDown } from 'lucide-react';

export const PropertyFilterDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filters = useFilterStore();
  
  const [minPrice, setMinPrice] = useState<number | ''>(filters.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState<number | ''>(filters.max_price ?? '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  // Sync state with store when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setMinPrice(filters.min_price ?? '');
      setMaxPrice(filters.max_price ?? '');
      setSelectedAmenities(filters.amenities || []);
    }
  }, [isOpen, filters.min_price, filters.max_price, filters.amenities]);

  const handleApply = () => {
    filters.setMinPrice(minPrice === '' ? undefined : Number(minPrice));
    filters.setMaxPrice(maxPrice === '' ? undefined : Number(maxPrice));
    filters.setAmenities(selectedAmenities);
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    filters.setMinPrice(undefined);
    filters.setMaxPrice(undefined);
    filters.setAmenities([]);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const AMENITIES_LIST = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parkir', icon: Car },
    { id: 'breakfast', label: 'Sarapan', icon: Coffee },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'workspace', label: 'Kerja', icon: Monitor },
    { id: 'kitchen', label: 'Dapur', icon: Utensils },
    { id: 'pool', label: 'Kolam', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
  ];

  const hasActiveFilters = filters.min_price !== undefined || filters.max_price !== undefined || (filters.amenities && filters.amenities.length > 0);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition border ${
          hasActiveFilters
            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
            : isOpen
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:text-rose-600'
        }`}
      >
        <SlidersHorizontal size={13} />
        Filter
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
        <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-5 z-40 origin-top-left animate-fade-in">
          <div className="space-y-5">
            {/* Price Range */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rentang Harga (Malam)</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Rp</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:text-white"
                    />
                  </div>
                </div>
                <span className="text-slate-300">-</span>
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Rp</span>
                    <input
                      type="number"
                      placeholder="Maks"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fasilitas</h4>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES_LIST.map(amenity => {
                  const isSelected = selectedAmenities.includes(amenity.id);
                  const Icon = amenity.icon;
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <Icon size={14} className="opacity-70" />
                      <span>{amenity.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={handleClear}
                className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white underline transition"
              >
                Hapus Semua
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-full hover:opacity-90 transition shadow-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
