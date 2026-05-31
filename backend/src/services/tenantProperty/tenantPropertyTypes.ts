export interface GetTenantPropertiesOptions {
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface NormalizedTenantPropertyOptions {
  search?: string;
  categoryId?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface PropertyFormData {
  categoryId?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string | null;
  amenities?: string | string[];
  latitude?: string | number | null;
  longitude?: string | number | null;
}
