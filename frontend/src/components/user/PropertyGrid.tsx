import type { FC } from 'react';
import type { Property } from '@/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { getDaysBetween } from '@/lib/formatters';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Pagination } from '../common/Pagination';
import { PropertyCardSkeleton } from '../common/Skeleton';
import PropertyCard from './PropertyCard';

interface Props {
  city: string;
  checkIn?: string;
  checkOut?: string;
  currentPage?: number;
  error?: string | null;
  loading: boolean;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  order?: 'asc' | 'desc';
  pageSize?: number;
  properties: Property[];
  sort?: string;
  totalCount: number;
  totalPages?: number;
  desktopCols?: 3 | 4;
}

const PropertyGrid: FC<Props> = (props) => {
  const nights = props.checkIn && props.checkOut ? getDaysBetween(props.checkIn, props.checkOut) : null;
  const heading = getHeading(props.sort || 'popularity', props.order || 'desc', props.totalCount);
  return <><PropertyGridHeading {...heading} city={props.city} nights={nights} totalCount={props.totalCount} /><PropertyGridBody {...props} /></>;
};

const PropertyGridBody: FC<Props> = (props) => {
  if (props.loading) return <PropertyGridSkeleton count={props.pageSize || ITEMS_PER_PAGE} desktopCols={props.desktopCols} />;
  if (props.error) return <ErrorState title="Properti belum bisa dimuat" message={props.error} onRetry={props.onRetry} />;
  if (!props.properties.length) return <EmptyPropertyResult city={props.city} />;
  return <><PropertyCards properties={props.properties} desktopCols={props.desktopCols} /><Pagination currentPage={props.currentPage || 1} totalPages={props.totalPages || 1} onPageChange={(page) => props.onPageChange?.(page)} /></>;
};

const PropertyGridSkeleton: FC<{ count: number; desktopCols?: 3 | 4 }> = ({ count, desktopCols = 4 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 ${desktopCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>{[...Array(count)].map((_, i) => <PropertyCardSkeleton key={i} />)}</div>
);

const PropertyCards: FC<{ properties: Property[]; desktopCols?: 3 | 4 }> = ({ properties, desktopCols = 4 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 ${desktopCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
);

const EmptyPropertyResult: FC<{ city: string }> = ({ city }) => (
  <EmptyState title={city ? 'Tidak ada properti untuk pencarian Anda' : 'Tidak ada properti tersedia saat ini'} description="Ubah kota, tanggal, harga, atau filter lain lalu coba lagi." />
);

const PropertyGridHeading: FC<Heading & { city: string; nights: number | null; totalCount: number }> = ({ city, nights, subtitle, title, totalCount }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{city ? `Properti di ${city}` : title}</h2>
    <p className="text-gray-600 dark:text-gray-400">{city ? `Ditemukan ${totalCount} properti tersedia${nights ? ` - ${nights} malam` : ''}` : subtitle}</p>
  </div>
);

interface Heading {
  subtitle: string;
  title: string;
}

const getHeading = (sort: string, order: 'asc' | 'desc', totalCount: number) => (
  headingMap(totalCount)[`${sort}_${order}`] ?? { title: 'Properti Terpopuler', subtitle: `Menampilkan ${totalCount} properti` }
);

const headingMap = (totalCount: number): Record<string, Heading> => ({
  created_at_asc: { title: 'Properti Terlama', subtitle: `Menampilkan ${totalCount} properti` },
  created_at_desc: { title: 'Properti Terbaru', subtitle: `Menampilkan ${totalCount} properti terbaru ditambahkan` },
  popularity_asc: { title: 'Properti Kurang Populer', subtitle: `Menampilkan ${totalCount} properti` },
  popularity_desc: { title: 'Properti Terpopuler', subtitle: `Menampilkan ${totalCount} properti paling banyak dipesan` },
  price_asc: { title: 'Properti Termurah', subtitle: `Menampilkan ${totalCount} properti dengan harga terendah` },
  price_desc: { title: 'Properti Termahal', subtitle: `Menampilkan ${totalCount} properti dengan harga tertinggi` },
  rating_asc: { title: 'Rating Terendah', subtitle: `Menampilkan ${totalCount} properti` },
  rating_desc: { title: 'Rating Tertinggi', subtitle: `Menampilkan ${totalCount} properti dengan rating terbaik` },
});

export default PropertyGrid;
