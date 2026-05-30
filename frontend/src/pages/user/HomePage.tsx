import type { FC } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useGeolocation } from '@/hooks/useGeolocation';
import { propertyService } from "@/services/propertyService";
import { useFilterStore } from "@/stores/filterStore";
import type { Property } from "@/types";
import { HeroSection } from "@/components/user/HeroSection";
import PropertyGrid from "@/components/user/PropertyGrid";
import SortFilterBar from "@/components/common/SortFilterBar";
import type { SortGroup } from "@/components/common/SortFilterBar";

const HomePage: FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // SOLUSI: Pisah antara filter draft dan active filter
  const filters = useFilterStore();

  const activeFilters = filters.activeFilters || filters.getFilterValues();
  const { detectCity } = useGeolocation();
  const hasRequestedCity = useRef(false);

  const sortGroups: SortGroup[] = [
    {
      key: "popularity",
      label: "Popularitas",
      icon: "trending",
      options: [
        { order: "desc", label: "Terpopuler" },
        { order: "asc", label: "Kurang Populer" },
      ],
    },
    {
      key: "price",
      label: "Harga",
      icon: "price",
      options: [
        { order: "desc", label: "Termahal" },
        { order: "asc", label: "Termurah" },
      ],
    },
    {
      key: "rating",
      label: "Rating",
      icon: "star",
      options: [
        { order: "desc", label: "Rating Tertinggi" },
        { order: "asc", label: "Rating Terendah" },
      ],
    },
    {
      key: "created_at",
      label: "Tanggal",
      icon: "clock",
      options: [
        { order: "desc", label: "Terbaru" },
        { order: "asc", label: "Terlama" },
      ],
    },
  ];

  // 1. Deteksi lokasi via LocationIQ saat pertama kali dimuat
  useEffect(() => {
    if (hasRequestedCity.current) return;
    hasRequestedCity.current = true;

    const currentFilters = useFilterStore.getState();
    if (!currentFilters.city && !currentFilters.search) {
      detectCity().then((city) => {
        if (city) {
          currentFilters.setCity(city);
          currentFilters.applyFilters();
        }
      });
    }
  }, [detectCity]);

  const hasFilterChanges = useMemo(() => {
    return JSON.stringify(filters.getFilterValues()) !== JSON.stringify(activeFilters);
  }, [filters, activeFilters]);

  // 3. PERUBAHAN: Fetch hanya ketika activeFilters berubah (bukan filters)
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const fetchParams =
          !activeFilters.city && !activeFilters.search
            ? {
                ...activeFilters,
                limit: 10,
              }
            : activeFilters;

        const result = await propertyService.getProperties(fetchParams);
        setProperties(result.items);
        setTotalCount(result.pagination?.total || 0);
        setTotalPages(result.pagination?.pages || 1);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Premium Hero Carousel & Trending Section */}
      <HeroSection />

      {/* Results */}
      <section
        id="results-section"
        className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24"
      >
        <SortFilterBar
          sortGroups={sortGroups}
          currentSort={filters.sort || "popularity"}
          currentOrder={(filters.order as "asc" | "desc") || "desc"}
          onChange={(sort, order) => {
            filters.setSort(sort);
            filters.setOrder(order);
            filters.applyFilters();
          }}
          resultCount={totalCount}
          resultLabel={
            activeFilters.city
              ? `properti di ${activeFilters.city}`
              : "properti terpopuler"
          }
          hasFilterChanges={hasFilterChanges}
          activeCity={activeFilters.city}
          onApplyFilters={() => {
            filters.applyFilters();
          }}
          onResetFilters={() => {
            filters.resetFilters();
          }}
          onClearCity={() => {
            filters.setCity("");
            filters.applyFilters();
          }}
        />

        <PropertyGrid
          properties={properties}
          loading={loading}
          totalCount={totalCount}
          city={activeFilters.city || ""}
          checkIn={activeFilters.check_in_date}
          checkOut={activeFilters.check_out_date}
          sort={activeFilters.sort || "popularity"}
          order={(activeFilters.order as "asc" | "desc") || "desc"}
          currentPage={activeFilters.page}
          totalPages={totalPages}
          onPageChange={(page) => {
            filters.setPage(page);
            filters.applyFilters();
          }}
        />
      </section>
    </div>
  );
};

export default HomePage;
