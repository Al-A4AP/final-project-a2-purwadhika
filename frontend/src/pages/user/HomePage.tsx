import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { propertyService } from '@/services/propertyService';
import { useFilterStore } from '@/stores/filterStore';
import type { Property } from '@/types';
import SearchForm from '@/components/user/SearchForm';
import PropertyGrid from '@/components/user/PropertyGrid';

const HomePage: FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const filters = useFilterStore();

  useEffect(() => {
    if (!filters.city && !filters.search) return;
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const result = await propertyService.getProperties(filters);
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
      {/* Hero */}
      <section className="bg-linear-to-br from-red-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Temukan Akomodasi Impian Anda
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Jelajahi berbagai pilihan properti dengan harga terbaik
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <PropertyGrid
          properties={properties}
          loading={loading}
          totalCount={totalCount}
          city={filters.city || ''}
          checkIn={filters.check_in_date}
          checkOut={filters.check_out_date}
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => filters.setPage(page)}
        />
      </section>
    </div>
  );
};

export default HomePage;
