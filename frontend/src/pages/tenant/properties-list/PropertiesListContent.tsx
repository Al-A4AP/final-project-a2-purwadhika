import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyProperties } from "./EmptyProperties";
import { PropertiesListView } from "./PropertiesListView";

interface PropertiesListContentProps {
  deletingId: string | null;
  error: string | null;
  onDelete: (id: string, name: string) => void;
  onRetry: () => void;
  properties: TenantProperty[];
}

export const PropertiesListContent: FC<PropertiesListContentProps> = (props) => {
  if (props.error) return <ErrorState title="Properti belum bisa dimuat" message={props.error} onRetry={props.onRetry} />;
  if (props.properties.length === 0) return <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"><EmptyProperties /></div>;
  return <PropertiesListView properties={props.properties} deletingId={props.deletingId} onDelete={props.onDelete} />;
};
