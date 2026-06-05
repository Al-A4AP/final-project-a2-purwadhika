import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { SectionLoading } from "@/components/common/SectionLoading";
import { PeakSeasonPropertyCard } from "./PeakSeasonPropertyCard";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const PeakSeasonPropertyList: FC<{ state: PeakSeasonPageState }> = ({ state }) => {
  if (state.isLoading) return <SectionLoading label="Memuat properti..." size="lg" variant="cards" />;
  if (state.error) return <ErrorState title="Properti belum bisa dimuat" message={state.error} onRetry={state.refetchProperties} />;
  if (!state.data?.properties.length) return <EmptyProperties />;
  return <PropertyListContent state={state} />;
};

const PropertyListContent: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <div className="space-y-4">
    {state.data!.properties.map((property) => <PeakSeasonPropertyCard key={property.id} property={property} state={state} />)}
    <Pagination
      currentPage={state.data!.pagination.page || state.filters.page}
      totalItems={state.data!.pagination.total}
      totalPages={state.data!.pagination.totalPages || state.data!.pagination.pages || 1}
      onPageChange={state.propertyActions.setPage}
    />
  </div>
);

const EmptyProperties: FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Tidak ada properti" description="Ubah filter atau tambahkan properti baru sebelum mengatur harga musiman." />
  </div>
);
