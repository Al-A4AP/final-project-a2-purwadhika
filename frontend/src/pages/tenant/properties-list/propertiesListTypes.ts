import type { TenantProperty } from "@/types";

export interface PropertiesListViewProps {
  properties: TenantProperty[];
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

export interface PropertyOnlyProps {
  property: TenantProperty;
}

export interface PropertyItemProps extends PropertyOnlyProps {
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

export interface PropertyImageProps extends PropertyOnlyProps {
  className: string;
}

export interface CompactPropertyActionProps extends PropertyOnlyProps {
  compact?: boolean;
}

export interface DeleteButtonProps extends PropertyItemProps {
  compact?: boolean;
}
