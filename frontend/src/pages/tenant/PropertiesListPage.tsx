import type { FC } from "react";
import { Search } from "lucide-react";
import { PropertiesConfirmModal } from "./properties-list/PropertiesConfirmModal";
import { PropertiesHeader } from "./properties-list/PropertiesHeader";
import { PropertiesSummary } from "./properties-list/PropertiesSummary";
import { PropertiesListContent } from "./properties-list/PropertiesListContent";
import { PropertiesPagination } from "./properties-list/PropertiesPagination";
import { usePropertiesFilters } from "@/hooks/tenant/properties-list/usePropertiesFilters";
import { usePropertyDeleteConfirm } from "@/hooks/tenant/properties-list/usePropertyDeleteConfirm";
import { useTenantPropertiesData } from "@/hooks/tenant/properties-list/useTenantPropertiesData";
import { SectionLoading } from "@/components/common/SectionLoading";
import SortFilterBar, { type SortGroup } from "@/components/common/SortFilterBar";

const sortGroups: SortGroup[] = [
  { key: 'name', label: 'Nama', icon: 'alpha', options: [{ order: 'asc', label: 'A-Z' }, { order: 'desc', label: 'Z-A' }] },
  { key: 'created_at', label: 'Dibuat', icon: 'clock', options: [{ order: 'desc', label: 'Terbaru' }, { order: 'asc', label: 'Terlama' }] },
];

const PropertiesListPage: FC = () => {
  const filters = usePropertiesFilters();
  const data = useTenantPropertiesData(filters);
  const deleteState = usePropertyDeleteConfirm(data.properties, data.setProperties);

  if (data.loading && data.properties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
        <SectionLoading variant="table" label="Memuat properti..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-7xl">
        <PropertiesHeader />
        <PropertiesSummary total={data.pagination.total} />

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div className="flex w-full md:w-96 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input 
                value={filters.searchQuery} 
                onChange={(event) => filters.setSearchQuery(event.target.value)} 
                onKeyDown={(event) => { if (event.key === 'Enter') filters.applySearch(); }} 
                placeholder="Cari properti..." 
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500" 
              />
            </div>
            <button 
              onClick={filters.applySearch} 
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Cari
            </button>
          </div>

          <SortFilterBar 
            sortGroups={sortGroups} 
            currentSort={filters.sortKey} 
            currentOrder={filters.sortOrder} 
            onChange={filters.setSort} 
            resultCount={data.pagination.total} 
            resultLabel="properti" 
          />
        </div>

        <div className="mt-6">
          <PropertiesListContent 
            error={data.error} 
            properties={data.properties} 
            deletingId={deleteState.deletingId} 
            onDelete={deleteState.handleDelete} 
            onRetry={() => data.fetchProperties(data.pagination.page || 1)} 
          />
        </div>
        
        <div className="mt-8">
          <PropertiesPagination 
            error={data.error} 
            propertiesCount={data.properties.length} 
            pagination={data.pagination} 
            fetchProperties={data.fetchProperties} 
          />
        </div>

        <PropertiesConfirmModal confirmModal={deleteState.confirmModal} onCancel={deleteState.closeConfirmModal} />
      </div>
    </div>
  );
};

export default PropertiesListPage;
