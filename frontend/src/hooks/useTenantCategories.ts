import { useCallback, useEffect, useReducer } from 'react';
import { toast } from 'react-hot-toast';
import { CATEGORY_DESCRIPTION_MAX_LENGTH } from '@/constants/validation';
import { getApiErrorMessage } from '@/lib/errorMessage';
import { tenantService } from '@/services/tenantService';
import type { PaginationMeta, PropertyCategory } from '@/types';

type Patch = Partial<CategoryState>;
type CategorySortBy = 'name' | 'updated_at';
type CategorySortOrder = 'asc' | 'desc';

interface CategoryState {
  categories: PropertyCategory[];
  pagination: PaginationMeta;
  error: string | null;
  loading: boolean;
  saving: boolean;
  sortBy: CategorySortBy;
  sortOrder: CategorySortOrder;
  deletingId: string | null;
}

const initialState: CategoryState = {
  categories: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  error: null,
  loading: true,
  saving: false,
  sortBy: 'name',
  sortOrder: 'asc',
  deletingId: null,
};

const reducer = (state: CategoryState, action: { patch: Patch }) => ({ ...state, ...action.patch });

const persistCategory = async (data: { name: string; description?: string; default_rental_type?: string }, editing?: PropertyCategory | null) => {
  if (editing) return tenantService.updateCategory(editing.id, data);
  return tenantService.createCategory(data);
};

const useCategoryLoad = (dispatch: React.Dispatch<{ patch: Patch }>, sortBy: CategorySortBy, sortOrder: CategorySortOrder) => {
  const load = useCallback(async (page = 1) => {
    dispatch({ patch: { error: null, loading: true } });
    try {
      const data = await tenantService.getCategories({ sortBy, sortOrder, page, limit: 10 });
      dispatch({ patch: { categories: data.categories, error: null, pagination: data.pagination } });
    } catch (err) { handleCategoryLoadError(err, dispatch); }
    finally { dispatch({ patch: { loading: false } }); }
  }, [dispatch, sortBy, sortOrder]);
  useEffect(() => { Promise.resolve().then(() => load(1)); }, [load]);
  return load;
};

const handleCategoryLoadError = (err: unknown, dispatch: React.Dispatch<{ patch: Patch }>) => {
  const message = getApiErrorMessage(err, 'Kategori belum bisa dimuat. Periksa koneksi lalu coba lagi.');
  dispatch({ patch: { categories: [], error: message } });
  toast.error(message);
};

const useCategorySave = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>, load: (page?: number) => Promise<void>) => (
  useCallback(async (data: { name: string; description?: string; default_rental_type?: string }, editing?: PropertyCategory | null) => {
    if (data.name.trim().length < 2) return toast.error('Nama kategori minimal 2 karakter');
    if (!isValidCategoryDescription(data.description)) return toast.error(`Deskripsi maksimal ${CATEGORY_DESCRIPTION_MAX_LENGTH} karakter`);
    dispatch({ patch: { saving: true } });
    try {
      await persistCategory(normalizeCategoryPayload(data), editing);
      toast.success(editing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil dibuat');
      await load(editing ? state.pagination.page : 1);
    } catch (err) { toast.error(getApiErrorMessage(err, getCategorySaveFallback(editing))); }
    finally { dispatch({ patch: { saving: false } }); }
  }, [dispatch, load, state.pagination.page])
);

const useCategoryDelete = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>, load: (page?: number) => Promise<void>) => (
  useCallback(async (category: PropertyCategory) => {
    dispatch({ patch: { deletingId: category.id } });
    try {
      await tenantService.deleteCategory(category.id);
      toast.success('Kategori berhasil dihapus');
      await load(state.pagination.page);
    } catch (err) { toast.error(getApiErrorMessage(err, `Kategori "${category.name}" gagal dihapus. Pastikan tidak sedang dipakai properti.`)); }
    finally { dispatch({ patch: { deletingId: null } }); }
  }, [dispatch, load, state.pagination.page])
);

const useCategoryControls = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>, load: (page?: number) => Promise<void>) => ({
  saveCategory: useCategorySave(state, dispatch, load),
  deleteCategory: useCategoryDelete(state, dispatch, load),
  setSort: useCategorySort(dispatch),
});

const useCategorySort = (dispatch: React.Dispatch<{ patch: Patch }>) =>
  useCallback((sortBy: CategorySortBy, sortOrder: CategorySortOrder) => {
    dispatch({ patch: { sortBy, sortOrder } });
  }, [dispatch]);

export const useTenantCategories = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const load = useCategoryLoad(dispatch, state.sortBy, state.sortOrder);
  const controls = useCategoryControls(state, dispatch, load);
  return { ...state, ...controls, load };
};

const getCategorySaveFallback = (editing?: PropertyCategory | null) =>
  editing
    ? 'Kategori gagal diperbarui. Pastikan nama belum digunakan.'
    : 'Kategori gagal dibuat. Pastikan nama belum digunakan.';

const isValidCategoryDescription = (description?: string) =>
  (description?.trim().length || 0) <= CATEGORY_DESCRIPTION_MAX_LENGTH;

const normalizeCategoryPayload = (data: {
  name: string;
  description?: string;
  default_rental_type?: string;
}) => ({ ...data, description: data.description?.trim(), name: data.name.trim() });
