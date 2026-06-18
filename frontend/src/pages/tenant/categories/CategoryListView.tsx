import type { FC } from "react";
import type { PropertyCategory } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { CategoryTable } from "./CategoryListParts";

interface CategoryListViewProps {
  categories: PropertyCategory[];
  loading: boolean;
  deletingId?: string | null;
  onEdit: (category: PropertyCategory) => void;
  onDelete: (category: PropertyCategory) => void;
}

export const CategoryListView: FC<CategoryListViewProps> = ({ categories, loading, deletingId, onEdit, onDelete }) => {
  if (loading) return <SectionLoading variant="table" label="Memuat daftar kategori..." />;
  if (!categories.length) return <CategoryEmptyState />;
  return <CategoryTable categories={categories} deletingId={deletingId} onDelete={onDelete} onEdit={onEdit} />;
};

const CategoryEmptyState = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Tidak ada kategori" description="Kategori tidak ditemukan. Tambahkan kategori untuk mulai mengorganisir properti Anda." />
  </div>
);
