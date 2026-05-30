import type { FC } from 'react';
import type { Property } from '@/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { getDaysBetween } from '@/lib/formatters';
import PropertyCard from './PropertyCard';
import { Pagination } from '../common/Pagination';
import { PropertyCardSkeleton } from '../common/Skeleton';

interface Props {
  properties: Property[];
  loading: boolean;
  totalCount: number;
  city: string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
}

const PropertyGrid: FC<Props> = ({
  properties, loading, totalCount, city, checkIn, checkOut,
  sort = 'popularity', order = 'desc',
  onPageChange, currentPage = 1, totalPages = 1, pageSize = ITEMS_PER_PAGE,
}) => {
  const nights = checkIn && checkOut ? getDaysBetween(checkIn, checkOut) : null;

  // buat map sort+order → { heading, subtitle } , untuk icon nati kita pikirin lg
  const sortKey = `${sort}_${order}`;
  const headingMap: Record<string, { title: string; subtitle: string }> = {
    popularity_desc: { title: 'Properti Terpopuler',  subtitle: `Menampilkan ${totalCount} properti paling banyak dipesan` },
    popularity_asc:  { title: 'Properti Kurang Populer', subtitle: `Menampilkan ${totalCount} properti` },
    price_desc:      { title: 'Properti Termahal',     subtitle: `Menampilkan ${totalCount} properti dengan harga tertinggi` },
    price_asc:       { title: 'Properti Termurah',     subtitle: `Menampilkan ${totalCount} properti dengan harga terendah` },
    rating_desc:     { title: 'Rating Tertinggi',      subtitle: `Menampilkan ${totalCount} properti dengan rating terbaik` },
    rating_asc:      { title: 'Rating Terendah',       subtitle: `Menampilkan ${totalCount} properti` },
    created_at_desc: { title: 'Properti Terbaru',     subtitle: `Menampilkan ${totalCount} properti terbaru ditambahkan` },
    created_at_asc:  { title: 'Properti Terlama',     subtitle: `Menampilkan ${totalCount} properti` },
  };

  const defaultHeading = { title: 'Properti Terpopuler', subtitle: `Menampilkan ${totalCount} properti` };
  const { title: dynamicTitle, subtitle: dynamicSubtitle } = headingMap[sortKey] ?? defaultHeading;

  if (loading === false && properties.length === 0 && !city) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada properti tersedia saat ini</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {city ? `Properti di ${city}` : dynamicTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {city
            ? `Ditemukan ${totalCount} properti tersedia${nights ? ` · ${nights} malam` : ''}`
            : dynamicSubtitle
          }
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(pageSize)].map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => onPageChange?.(page)}
          />
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
