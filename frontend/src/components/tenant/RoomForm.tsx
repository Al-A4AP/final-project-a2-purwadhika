import type { FC } from 'react';
import type { RoomFormInput } from '@/types';

interface RoomFormProps {
  isEditing: boolean;
  form: RoomFormInput;
  onChange: (form: RoomFormInput) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RoomForm: FC<RoomFormProps> = ({ isEditing, form, onChange, onSubmit }) => {
  const inputClass = "w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none";
  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">{isEditing ? 'Edit Kamar' : 'Kamar Baru'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Kamar</label>
          <input value={form.room_type} onChange={(e) => onChange({ ...form, room_type: e.target.value })} placeholder="cth. Deluxe Room" className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Harga Dewasa/malam (Rp)</label>
          <input type="number" min="0" value={form.base_price} onChange={(e) => onChange({ ...form, base_price: e.target.value })} placeholder="500000" className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Harga Anak-anak/malam (Rp)</label>
          <input type="number" min="0" value={form.child_price ?? ''} onChange={(e) => onChange({ ...form, child_price: e.target.value })} placeholder="Kosongkan jika = dewasa" className={inputClass} />
          <p className="text-xs text-gray-400 mt-0.5">Bayi selalu gratis</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kapasitas (orang)</label>
          <input type="number" min="1" value={form.capacity} onChange={(e) => onChange({ ...form, capacity: e.target.value })} placeholder="2" className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Jumlah Unit</label>
          <input type="number" min="1" value={form.quantity || "1"} onChange={(e) => onChange({ ...form, quantity: e.target.value })} placeholder="1" className={inputClass} required />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Foto Kamar</label>
          <input type="file" accept="image/*" onChange={(e) => onChange({ ...form, image: e.target.files?.[0] || null })} className={inputClass} required={!isEditing} />
          <p className="text-xs text-gray-400 mt-0.5">{isEditing ? "Kosongkan jika tidak ingin menambah foto baru" : "Minimal 1 foto kamar wajib diupload"}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Deskripsi (opsional)</label>
          <input value={form.description || ''} onChange={(e) => onChange({ ...form, description: e.target.value })} className={inputClass} />
        </div>
      </div>
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
        Simpan Kamar
      </button>
    </form>
  );
};
