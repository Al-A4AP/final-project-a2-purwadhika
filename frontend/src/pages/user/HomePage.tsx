import type { FC } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { propertyService } from "@/services/propertyService";
import { useFilterStore } from "@/stores/filterStore";
import type { Property } from "@/types";
import { HeroSection } from "@/components/user/HeroSection";
import PropertyGrid from "@/components/user/PropertyGrid";
import SortFilterBar from "@/components/common/SortFilterBar";
import type { SortGroup } from "@/components/common/SortFilterBar";

type FilterValues = {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search: string;
  city: string;
  category: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  babies: number;
  capacity?: number;
  min_price?: number;
  max_price?: number;
  amenities: string[];
};

const HomePage: FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // SOLUSI: Pisah antara filter draft dan active filter
  const filters = useFilterStore();

  const extractFilterValues = (filterObj: typeof filters): FilterValues => ({
    page: filterObj.page || 1,
    limit: filterObj.limit || 12,
    sort: filterObj.sort || "created_at",
    order: filterObj.order || "desc",
    search: filterObj.search || "",
    city: filterObj.city || "",
    category: filterObj.category || "",
    check_in_date: filterObj.check_in_date || "",
    check_out_date: filterObj.check_out_date || "",
    adults: filterObj.adults || 1,
    children: filterObj.children || 0,
    babies: filterObj.babies || 0,
    capacity: filterObj.capacity,
    min_price: filterObj.min_price,
    max_price: filterObj.max_price,
    amenities: filterObj.amenities || [],
  });

  const [activeFilters, setActiveFilters] = useState<FilterValues>(
    extractFilterValues(filters),
  );
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

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
    if (navigator.geolocation && !filters.city && !filters.search) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
          if (!apiKey) return;

          const res = await axios.get(
            `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`,
          );
          const address = res.data.address;
          const detectedCity =
            address.city || address.town || address.county || address.state;

          if (detectedCity) {
            filters.setCity(detectedCity);
            // Update activeFilters juga untuk initial load
            setActiveFilters((prev) => ({
              ...prev,
              city: detectedCity,
            }));
          }
        } catch (error) {
          console.error(
            "Gagal mendeteksi lokasi atau limit API LocationIQ habis",
            error,
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Bandingkan filter draft dengan active filter
    const hasChanges =
      filters.city !== activeFilters.city ||
      filters.search !== activeFilters.search ||
      filters.check_in_date !== activeFilters.check_in_date ||
      filters.check_out_date !== activeFilters.check_out_date ||
      filters.sort !== activeFilters.sort ||
      filters.order !== activeFilters.order ||
      filters.page !== activeFilters.page;

    setHasFilterChanges(hasChanges);
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
      } catch (error) {
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
            setActiveFilters(extractFilterValues(filters));
            setHasFilterChanges(false);
          }}
          onResetFilters={() => {
            filters.resetFilters();
            setActiveFilters(extractFilterValues(filters));
            setHasFilterChanges(false);
          }}
          onClearCity={() => {
            filters.setCity("");
            setActiveFilters((prev) => ({ ...prev, city: "" }));
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
            setActiveFilters((prev) => ({ ...prev, page }));
          }}
        />
      </section>
    </div>
  );
};

export default HomePage;
