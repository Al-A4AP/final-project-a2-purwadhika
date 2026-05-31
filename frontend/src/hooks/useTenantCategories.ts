import { useCallback, useEffect, useReducer } from 'react';
import { toast } from 'react-hot-toast';
import { tenantService } from '@/services/tenantService';
import type { PaginationMeta, PropertyCategory } from '@/types';

type SortBy = 'name' | 'updated_at';
type SortOrder = 'asc' | 'desc';
type Patch = Partial<CategoryState>;

interface CategoryState {
  categories: PropertyCategory[];
  pagination: PaginationMeta;
  searchInput: string;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  loading: boolean;
  saving: boolean;
  deletingId: string | null;
}

const initialState: CategoryState = {
  categories: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  searchInput: '',
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  loading: true,
  saving: false,
  deletingId: null,
};

const reducer = (state: CategoryState, action: { patch: Patch }) => ({ ...state, ...action.patch });
const apiMessage = (err: unknown, fallback: string) => (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

const persistCategory = async (name: string, editing?: PropertyCategory | null) => {
  if (editing) return tenantService.updateCategory(editing.id, name);
  return tenantService.createCategory(name);
};

const useCategoryLoad = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>) => {
  const load = useCallback(async (page = 1) => {
    dispatch({ patch: { loading: true } });
    try {
      const data = await tenantService.getCategories({ search: state.search, sortBy: state.sortBy, sortOrder: state.sortOrder, page, limit: 10 });
      dispatch({ patch: { categories: data.categories, pagination: data.pagination } });
    } catch { toast.error('Gagal memuat kategori'); }
    finally { dispatch({ patch: { loading: false } }); }
  }, [state.search, state.sortBy, state.sortOrder, dispatch]);
  useEffect(() => { Promise.resolve().then(() => load(1)); }, [load]);
  return load;
};

const useCategorySave = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>, load: (page?: number) => Promise<void>) => (
  useCallback(async (name: string, editing?: PropertyCategory | null) => {
    if (name.trim().length < 2) return toast.error('Nama kategori minimal 2 karakter');
    dispatch({ patch: { saving: true } });
    try {
      await persistCategory(name.trim(), editing);
      toast.success(editing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil dibuat');
      await load(editing ? state.pagination.page : 1);
    } catch (err: unknown) { toast.error(apiMessage(err, 'Gagal menyimpan kategori')); }
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
    } catch (err: unknown) { toast.error(apiMessage(err, 'Gagal menghapus kategori')); }
    finally { dispatch({ patch: { deletingId: null } }); }
  }, [dispatch, load, state.pagination.page])
);

const useCategoryControls = (state: CategoryState, dispatch: React.Dispatch<{ patch: Patch }>, load: (page?: number) => Promise<void>) => ({
  setSearchInput: (searchInput: string) => dispatch({ patch: { searchInput } }),
  applySearch: () => dispatch({ patch: { search: state.searchInput.trim() } }),
  changeSort: (sortBy: SortBy, sortOrder: SortOrder) => dispatch({ patch: { sortBy, sortOrder } }),
  saveCategory: useCategorySave(state, dispatch, load),
  deleteCategory: useCategoryDelete(state, dispatch, load),
});

export const useTenantCategories = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const load = useCategoryLoad(state, dispatch);
  const controls = useCategoryControls(state, dispatch, load);
  return { ...state, ...controls, load };
};
