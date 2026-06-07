import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTenantCategories } from "@/hooks/useTenantCategories";
import { isDefaultCategoryName } from "@/lib/defaultCategories";
import type { PropertyCategory } from "@/types";

export const useCategoryViewState = (): CategoryViewState => {
  const data = useTenantCategories();
  const modal = useCategoryModalState();
  const handleSave = useCategorySave(data, modal);
  const handleDelete = useCategoryDelete(data, modal);
  return buildCategoryViewState(data, modal, handleSave, handleDelete);
};

const useCategoryModalState = () => {
  const [editing, setEditing] = useState<PropertyCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<PropertyCategory | null>(null);
  return { editing, isAddModalOpen, setEditing, setIsAddModalOpen, setTargetDelete, targetDelete };
};

const useCategorySave = (data: CategoryData, modal: CategoryModalState) => async (categoryData: { name: string; description?: string; default_rental_type?: string }) => {
  await data.saveCategory(categoryData, modal.editing);
  modal.setEditing(null);
  modal.setIsAddModalOpen(false);
};

const useCategoryDelete = (data: CategoryData, modal: CategoryModalState) => async () => {
  if (!modal.targetDelete) return;
  await data.deleteCategory(modal.targetDelete);
  modal.setTargetDelete(null);
};

const buildCategoryViewState = (
  data: CategoryData,
  modal: CategoryModalState,
  handleSave: (data: { name: string; description?: string; default_rental_type?: string }) => Promise<void>,
  handleDelete: () => Promise<void>,
): CategoryViewState => ({
  data,
  ...pickModalState(modal),
  ...buildCategoryActions(modal, handleSave, handleDelete),
  totalPages: getTotalPages(data),
});

const pickModalState = (modal: CategoryModalState) => ({
  editing: modal.editing,
  isAddModalOpen: modal.isAddModalOpen,
  targetDelete: modal.targetDelete,
});

const buildCategoryActions = (
  modal: CategoryModalState,
  handleSave: (data: { name: string; description?: string; default_rental_type?: string }) => Promise<void>,
  handleDelete: () => Promise<void>,
) => ({
  closeModal: () => closeCategoryModal(modal),
  handleDelete,
  handleSave,
  openAddModal: () => modal.setIsAddModalOpen(true),
  requestDelete: (category: PropertyCategory) => requestCategoryDelete(category, modal.setTargetDelete),
  requestEdit: (category: PropertyCategory) => requestCategoryEdit(category, modal.setEditing),
  resetTargetDelete: () => modal.setTargetDelete(null),
});

const requestCategoryDelete = (category: PropertyCategory, setTargetDelete: SetCategory) => {
  if (!isDefaultCategory(category, "dihapus")) setTargetDelete(category);
};

const requestCategoryEdit = (category: PropertyCategory, setEditing: SetCategory) => {
  if (!isDefaultCategory(category, "diubah")) setEditing(category);
};

const isDefaultCategory = (category: PropertyCategory, action: "diubah" | "dihapus") => {
  if (!isDefaultCategoryName(category.name)) return false;
  toast.error(`Kategori default sistem tidak bisa ${action}`);
  return true;
};

const closeCategoryModal = (modal: CategoryModalState) => {
  modal.setEditing(null);
  modal.setIsAddModalOpen(false);
};

const getTotalPages = (data: CategoryData) =>
  data.pagination.totalPages || data.pagination.pages || 1;

type CategoryData = ReturnType<typeof useTenantCategories>;
type CategoryModalState = ReturnType<typeof useCategoryModalState>;
type SetCategory = (category: PropertyCategory | null) => void;

export interface CategoryViewState {
  closeModal: () => void;
  data: CategoryData;
  editing: PropertyCategory | null;
  handleDelete: () => Promise<void>;
  handleSave: (data: { name: string; description?: string; default_rental_type?: string }) => Promise<void>;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  requestDelete: (category: PropertyCategory) => void;
  requestEdit: (category: PropertyCategory) => void;
  resetTargetDelete: () => void;
  targetDelete: PropertyCategory | null;
  totalPages: number;
}
