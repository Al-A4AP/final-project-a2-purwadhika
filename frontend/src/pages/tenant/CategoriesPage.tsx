import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { toast } from 'react-hot-toast';
import { Tag, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import type { PropertyCategory } from '@/types';

const CategoriesPage: FC = () => {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', icon: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    propertyService.getCategories()
      .then(setCategories)
      .catch(() => toast.error('Gagal memuat kategori'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Nama kategori wajib diisi');
    
    setSubmitting(true);
    try {
      if (editingId) {
        await tenantService.updateCategory(editingId, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await tenantService.createCategory(formData);
        toast.success('Kategori berhasil ditambahkan');
      }
      resetForm();
      setLoading(true);
      fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini? Pastikan tidak ada properti yang menggunakannya.')) return;
    
    try {
      await tenantService.deleteCategory(id);
      toast.success('Kategori berhasil dihapus');
      setLoading(true);
      fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Gagal menghapus kategori');
    }
  };

  const startEdit = (cat: PropertyCategory) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, icon: cat.icon || '' });
    setIsAdding(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', icon: '' });
    setIsAdding(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Tag className="text-red-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kategori Properti</h1>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
            <Plus size={18} /> Tambah Kategori
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Kategori' : 'Kategori Baru'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Misal: Villa, Apartemen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (Emoji atau Teks Singkat) - Opsional</label>
              <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Misal: 🏨" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Save size={16} /> {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={resetForm} disabled={submitting} className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <X size={16} /> Batal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <p className="text-gray-500 font-medium">Belum ada kategori terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon || '🏷️'}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{cat.name}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
