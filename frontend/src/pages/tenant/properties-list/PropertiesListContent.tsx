import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyProperties } from "./EmptyProperties";
import { PropertiesGrid } from "./PropertiesGrid";

interface PropertiesListContentProps {
  deletingId: string | null;
  error: string | null;
  onDelete: (id: string, name: string) => void;
  onRetry: () => void;
  properties: TenantProperty[];
}

export const PropertiesListContent: FC<PropertiesListContentProps> = (props) => {
  if (props.error) return <ErrorState title="Properti belum bisa dimuat" message={props.error} onRetry={props.onRetry} />;
  if (props.properties.length === 0) return <EmptyProperties />;
  return <PropertiesGrid properties={props.properties} deletingId={props.deletingId} onDelete={props.onDelete} />;
};
