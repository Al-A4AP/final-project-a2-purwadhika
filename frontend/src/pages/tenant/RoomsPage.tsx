import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import type { RoomWithPeakRates, PeakSeasonRate, RoomFormInput } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface RoomCardProps {
  room: RoomWithPeakRates;
  onDelete: (id: string) => void;
  onEdit: (room: RoomWithPeakRates) => void;
}

const RoomCard: FC<RoomCardProps> = ({ room, onDelete, onEdit }) => {
  const [showRates, setShowRates] = useState(false);
  return (
    <div className="border dark:border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{room.room_type}</h3>
          <p className="text-sm text-gray-500">Kapasitas: {room.capacity} orang · {formatPrice(room.base_price)}/malam</p>
          {room.description && <p className="text-xs text-gray-400 mt-1">{room.description}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(room)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(room.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {room.peakRates?.length > 0 && (
        <div>
          <button onClick={() => setShowRates(!showRates)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            {showRates ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {room.peakRates.length} Peak Rate
          </button>
          {showRates && (
            <div className="mt-2 space-y-1">
              {room.peakRates.map((r: PeakSeasonRate) => (
                <div key={r.id} className="text-xs flex justify-between bg-orange-50 dark:bg-orange-900/10 rounded px-3 py-1.5">
                  <span>{new Date(r.start_date).toLocaleDateString('id-ID')} – {new Date(r.end_date).toLocaleDateString('id-ID')}</span>
                  <span className="font-medium text-orange-600">
                    {r.rate_type === 'PERCENTAGE' ? `+${r.rate_value}%` : `+${formatPrice(r.rate_value)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RoomsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomWithPeakRates[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomWithPeakRates | null>(null);
  const [form, setForm] = useState<RoomFormInput>({ room_type: '', base_price: '', capacity: '', description: '' });

  const fetchRooms = useCallback(() => {
    if (!id) return;
    tenantService.getRooms(id).then(setRooms).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      if (editingRoom) { await tenantService.updateRoom(editingRoom.id, form); }
      else { await tenantService.createRoom(id, form); }
      setShowForm(false); setEditingRoom(null);
      setForm({ room_type: '', base_price: '', capacity: '', description: '' });
      fetchRooms();
    } catch { alert('Gagal menyimpan kamar'); }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Hapus kamar ini?')) return;
    await tenantService.deleteRoom(roomId);
    fetchRooms();
  };

  const handleEdit = (room: RoomWithPeakRates) => {
    setEditingRoom(room);
    setForm({ room_type: room.room_type, base_price: String(room.base_price), capacity: String(room.capacity), description: room.description || '' });
    setShowForm(true);
  };

  const inputClass = "w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tenant/properties')} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kamar</h1>
      </div>

      <button onClick={() => { setShowForm(!showForm); setEditingRoom(null); setForm({ room_type: '', base_price: '', capacity: '', description: '' }); }}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
      >
        <Plus size={16} /> {showForm ? 'Batal' : 'Tambah Kamar'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{editingRoom ? 'Edit Kamar' : 'Kamar Baru'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Kamar</label>
              <input value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })} placeholder="cth. Deluxe Room" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Harga/malam (Rp)</label>
              <input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} placeholder="500000" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kapasitas (orang)</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="2" className={inputClass} required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Deskripsi (opsional)</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
            Simpan Kamar
          </button>
        </form>
      )}

      {loading ? <div className="h-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-xl" /> : (
        <div className="space-y-3">
          {rooms.length === 0 ? <p className="text-gray-500 text-sm">Belum ada kamar. Tambahkan kamar pertama.</p> : (
            rooms.map((r) => <RoomCard key={r.id} room={r} onDelete={handleDelete} onEdit={handleEdit} />)
          )}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
