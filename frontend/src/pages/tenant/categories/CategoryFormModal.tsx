import type { FC } from "react";
import { Modal } from "@/components/common/Modal";
import type { PropertyCategory } from "@/types";
import { useCategoryForm } from "@/hooks/tenant/categories/useCategoryForm";
import {
  CategoryFormActions,
  CategoryFormFields,
  CategoryFormIcon,
} from "./CategoryFormSections";

interface CategoryFormModalProps {
  isOpen: boolean;
  editing: PropertyCategory | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    default_rental_type?: string;
  }) => Promise<void> | void;
}

export const CategoryFormModal: FC<CategoryFormModalProps> = ({
  isOpen,
  editing,
  saving,
  onClose,
  onSubmit,
}) => {
  const form = useCategoryForm({ isOpen, editing, onSubmit });
  return <CategoryFormModalView isOpen={isOpen} editing={editing} saving={saving} onClose={onClose} form={form} />;
};

type CategoryFormState = ReturnType<typeof useCategoryForm>;

const CategoryFormModalView: FC<Omit<CategoryFormModalProps, "onSubmit"> & { form: CategoryFormState }> = ({ isOpen, editing, saving, onClose, form }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editing ? "Edit Kategori" : "Tambah Kategori Baru"} maxWidth="md">
    <form onSubmit={form.handleSubmit} className="p-6">
      <CategoryFormIcon />
      <CategoryFormFields form={form} saving={saving} />
      <CategoryFormActions editing={Boolean(editing)} name={form.name} onClose={onClose} saving={saving} />
    </form>
  </Modal>
);
