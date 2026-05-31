import type { FC } from "react";
import { PropertiesConfirmModal } from "./properties-list/PropertiesConfirmModal";
import { PropertiesHeader } from "./properties-list/PropertiesHeader";
import { PropertiesListContent } from "./properties-list/PropertiesListContent";
import { PropertiesLoading } from "./properties-list/PropertiesLoading";
import { PropertiesPagination } from "./properties-list/PropertiesPagination";
import { PropertiesToolbar } from "./properties-list/PropertiesToolbar";
import { usePropertiesFilters } from "./properties-list/usePropertiesFilters";
import { usePropertyDeleteConfirm } from "./properties-list/usePropertyDeleteConfirm";
import { useTenantPropertiesData } from "./properties-list/useTenantPropertiesData";

const PropertiesListPage: FC = () => {
  const filters = usePropertiesFilters();
  const data = useTenantPropertiesData(filters);
  const deleteState = usePropertyDeleteConfirm(data.properties, data.setProperties);
  if (data.loading) return <PropertiesLoading />;
  return (
    <div className="space-y-6 p-6 md:p-8">
      <PropertiesHeader />
      <PropertiesToolbar filters={filters} pagination={data.pagination} properties={data.properties} />
      <PropertiesListContent error={data.error} properties={data.properties} deletingId={deleteState.deletingId} onDelete={deleteState.handleDelete} onRetry={() => data.fetchProperties(data.pagination.page || 1)} />
      <PropertiesPagination error={data.error} propertiesCount={data.properties.length} pagination={data.pagination} fetchProperties={data.fetchProperties} />
      <PropertiesConfirmModal confirmModal={deleteState.confirmModal} onCancel={deleteState.closeConfirmModal} />
    </div>
  );
};

export default PropertiesListPage;
