import type { FC } from "react";
import { PropertiesConfirmModal } from "./properties-list/PropertiesConfirmModal";
import { PropertiesHeader } from "./properties-list/PropertiesHeader";
import { PropertiesSummary } from "./properties-list/PropertiesSummary";
import { PropertiesListContent } from "./properties-list/PropertiesListContent";
import { PropertiesPagination } from "./properties-list/PropertiesPagination";
import { PropertiesFilterPanel } from "./properties-list/PropertiesFilterPanel";
import { usePropertiesFilters } from "@/hooks/tenant/properties-list/usePropertiesFilters";
import { usePropertyCategoryOptions } from "@/hooks/tenant/properties-list/usePropertyCategoryOptions";
import { usePropertyDeleteConfirm } from "@/hooks/tenant/properties-list/usePropertyDeleteConfirm";
import { useTenantPropertiesData } from "@/hooks/tenant/properties-list/useTenantPropertiesData";
import { SectionLoading } from "@/components/common/SectionLoading";

const PropertiesListPage: FC = () => {
  const filters = usePropertiesFilters();
  const categories = usePropertyCategoryOptions();
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

        <PropertiesFilterPanel categories={categories} filters={filters} total={data.pagination.total} />

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
