import type { FC } from 'react';
import type { Property } from '@/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { getDaysBetween } from '@/lib/formatters';
import PropertyCard from './PropertyCard';

interface Props {
  properties: Property[];
  loading: boolean;
  totalCount: number;
  city: string;
  checkIn?: string;
  checkOut?: string;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const SkeletonCard: FC = () => (
  <div className="bg-gray-200 dark:bg-slate-700 rounded-lg h-64 animate-pulse" />
);

const PropertyGrid: FC<Props> = ({
  properties, loading, totalCount, city, checkIn, checkOut, onPageChange, currentPage = 1, totalPages = 1,
}) => {
  const nights = checkIn && checkOut ? getDaysBetween(checkIn, checkOut) : null;

  if (!city) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Mulai dengan memilih kota dan tanggal untuk melihat properti tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Properti di {city}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Ditemukan {totalCount} properti tersedia{nights ? ` · ${nights} malam` : ''}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
                    i + 1 === currentPage
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada properti tersedia untuk pencarian Anda</p>
        </div>
      )}
    </>
  );
};

export default PropertyGrid;
