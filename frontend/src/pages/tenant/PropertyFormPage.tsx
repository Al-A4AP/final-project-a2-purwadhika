import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import type { PropertyCategory } from '@/types';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(3, 'Minimal 3 karakter'),
  description: z.string().min(20, 'Minimal 20 karakter'),
  categoryId: z.string().min(1, 'Pilih kategori'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().optional(),
  amenities: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});
type FormInput = z.infer<typeof schema>;

const PropertyFormPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    propertyService.getCategories().then(setCategories);
    if (isEdit && id) {
      tenantService.getProperty(id)
        .then((p) => reset({
          name: p.name, description: p.description, categoryId: p.categoryId,
          address: p.address, city: p.city, province: p.province || '',
          amenities: p.amenities?.join(',') || '',
          latitude: p.latitude?.toString() || '', longitude: p.longitude?.toString() || '',
        }))
        .catch((err) => {
          const axiosErr = err as AxiosError<ApiResponse<null>>;
          toast.error(axiosErr.response?.data?.message || 'Properti tidak ditemukan atau Anda tidak memiliki akses');
          navigate('/tenant/properties');
        });
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: FormInput) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v); });
    if (file) fd.append('featured_image', file);
    try {
      if (isEdit && id) { await tenantService.updateProperty(id, fd); }
      else { await tenantService.createProperty(fd); }
      navigate('/tenant/properties');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      toast.error(axiosErr.response?.data?.message || 'Gagal menyimpan properti');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft size={16} /> Kembali
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{isEdit ? 'Edit Properti' : 'Tambah Properti Baru'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Properti</label>
          <input {...register('name')} placeholder="cth. Grand Menteng Hotel" className={inputClass} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
          <select {...register('categoryId')} className={inputClass}>
            <option value="">Pilih kategori...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
          <textarea {...register('description')} rows={4} placeholder="Jelaskan properti Anda..." className={inputClass} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kota</label>
            <input {...register('city')} placeholder="cth. Jakarta" className={inputClass} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provinsi</label>
            <input {...register('province')} placeholder="cth. DKI Jakarta" className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
            <input {...register('address')} placeholder="Jl. Contoh No. 1" className={inputClass} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fasilitas</label>
          <input {...register('amenities')} placeholder="wifi,parking,pool" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma. Contoh: wifi,parking,breakfast</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Utama</label>
          <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-red-400 transition">
            {preview ? (
              <img src={preview} className="w-full h-40 object-cover rounded-lg" alt="preview" />
            ) : (
              <>
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500">Klik untuk upload foto (maks. 1MB)</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : 'Simpan Properti'}
        </button>
      </form>
    </div>
  );
};

export default PropertyFormPage;
