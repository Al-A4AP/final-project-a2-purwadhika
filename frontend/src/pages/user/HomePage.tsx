import type { FC } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { propertyService } from '@/services/propertyService';
import { useFilterStore } from '@/stores/filterStore';
import type { Property } from '@/types';
import { HeroSection } from '@/components/user/HeroSection';
import PropertyGrid from '@/components/user/PropertyGrid';
import SortFilterBar from '@/components/common/SortFilterBar';
import type { SortGroup } from '@/components/common/SortFilterBar';

const HomePage: FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const filters = useFilterStore();

  const sortGroups: SortGroup[] = [
    {
      key: 'popularity', label: 'Popularitas', icon: 'trending',
      options: [
        { order: 'desc', label: 'Terpopuler' },
        { order: 'asc',  label: 'Kurang Populer' },
      ],
    },
    {
      key: 'price', label: 'Harga', icon: 'price',
      options: [
        { order: 'desc', label: 'Termahal' },
        { order: 'asc',  label: 'Termurah' },
      ],
    },
    {
      key: 'rating', label: 'Rating', icon: 'star',
      options: [
        { order: 'desc', label: 'Rating Tertinggi' },
        { order: 'asc',  label: 'Rating Terendah' },
      ],
    },
    {
      key: 'created_at', label: 'Tanggal', icon: 'clock',
      options: [
        { order: 'desc', label: 'Terbaru' },
        { order: 'asc',  label: 'Terlama' },
      ],
    },
  ];

  // 1. Deteksi lokasi via LocationIQ saat pertama kali dimuat
  useEffect(() => {
    if (navigator.geolocation && !filters.city && !filters.search) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
          if (!apiKey) return; // Skip jika API key belum di-set di .env
          
          const res = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`);
          const address = res.data.address;
          const detectedCity = address.city || address.town || address.county || address.state;
          
          if (detectedCity) {
            filters.setCity(detectedCity);
          }
        } catch (error) {
          console.error("Gagal mendeteksi lokasi atau limit API LocationIQ habis", error);
        }
      });
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya berjalan sekali saat komponen di-mount

  // 2. Fetch properti, akan selalu berjalan meskipun filter kosong
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Jika filter kosong, tampilkan 10 properti paling populer (banyak dipesan)
        const fetchParams = (!filters.city && !filters.search)
          ? { ...filters, limit: 10, sort: 'popularity', order: 'desc' as 'asc' | 'desc' }
          : filters;
          
        const result = await propertyService.getProperties(fetchParams);
        setProperties(result.items);
        setTotalCount(result.pagination.total);
        setTotalPages(result.pagination.pages);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Premium Hero Carousel & Trending Section */}
      <HeroSection />

      {/* Results */}
      <section id="results-section" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
        <SortFilterBar
          sortGroups={sortGroups}
          currentSort={filters.sort || 'popularity'}
          currentOrder={(filters.order as 'asc' | 'desc') || 'desc'}
          onChange={(sort, order) => {
            filters.setSort(sort);
            filters.setOrder(order);
          }}
          resultCount={totalCount}
          resultLabel={filters.city ? `properti di ${filters.city}` : 'properti terpopuler'}
        />
        <PropertyGrid
          properties={properties}
          loading={loading}
          totalCount={totalCount}
          city={filters.city || ''}
          checkIn={filters.check_in_date}
          checkOut={filters.check_out_date}
          sort={filters.sort || 'popularity'}
          order={(filters.order as 'asc' | 'desc') || 'desc'}
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => filters.setPage(page)}
        />
      </section>
    </div>
  );
};

export default HomePage;
