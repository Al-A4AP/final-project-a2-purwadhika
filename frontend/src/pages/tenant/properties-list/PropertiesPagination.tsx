import type { FC } from "react";
import type { PaginationMeta } from "@/types";
import { Pagination } from "@/components/common/Pagination";

const totalPages = (pagination: PaginationMeta) => pagination.totalPages || pagination.pages || 1;

export const PropertiesPagination: FC<{ error: string | null; fetchProperties: (page: number) => void; pagination: PaginationMeta; propertiesCount: number }> = (props) => (
  !props.error && props.propertiesCount > 0 ? <Pagination currentPage={props.pagination.page || 1} totalPages={totalPages(props.pagination)} totalItems={props.pagination.total} onPageChange={props.fetchProperties} /> : null
);
