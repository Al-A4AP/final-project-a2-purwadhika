import type { FC } from "react";
import type { PropertiesListViewProps } from "./propertiesListTypes";
import { DesktopPropertiesTable } from "./PropertiesListDesktop";
import { MobilePropertiesList } from "./PropertiesListMobile";

export const PropertiesListView: FC<PropertiesListViewProps> = ({ properties, deletingId, onDelete }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <MobilePropertiesList deletingId={deletingId} onDelete={onDelete} properties={properties} />
    <DesktopPropertiesTable deletingId={deletingId} onDelete={onDelete} properties={properties} />
  </div>
);
