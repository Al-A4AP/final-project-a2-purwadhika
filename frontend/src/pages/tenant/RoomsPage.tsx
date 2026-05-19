import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { availabilityService, type RoomAvailability } from '@/services/availabilityService';
import type { RoomWithPeakRates, PeakSeasonRate, RoomFormInput, TenantPropertyDetail } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
// slh satu yg lbh dari 200 brs, blm dipecah. blm lahi cek yg max 15 brs fungtion

interface RoomCardProps {
  room: RoomWithPeakRates;
  onDelete: (id: string) => void;
  onEdit: (room: RoomWithPeakRates) => void;
  onOpenAvail: (id: string) => void;
}

const RoomCard: FC<RoomCardProps> = ({ room, onDelete, onEdit, onOpenAvail }) => {
  const [showRates, setShowRates] = useState(false);
  return (
    <div className="border dark:border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{room.room_type}</h3>
          <p className="text-sm text-gray-500">Kapasitas: {room.capacity} orang · {formatPrice(room.base_price)}/malam (Dewasa)</p>
          {room.child_price != null && (
            <p className="text-xs text-blue-600 dark:text-blue-400">{formatPrice(room.child_price)}/malam (Anak) · Bayi: Gratis</p>
          )}
          {room.description && <p className="text-xs text-gray-400 mt-1">{room.description}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onOpenAvail(room.id)} className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <CalendarIcon size={14} />
          </button>
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
  const [property, setProperty] = useState<TenantPropertyDetail | null>(null);
  const [availabilities, setAvailabilities] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomWithPeakRates | null>(null);
  const [form, setForm] = useState<RoomFormInput>({ room_type: '', base_price: '', child_price: '', capacity: '', description: '' });

  const fetchRooms = useCallback(() => {
    if (!id) return;
    Promise.all([
      tenantService.getRooms(id),
      tenantService.getProperty(id)
    ]).then(([roomsData, propData]) => {
      setRooms(roomsData);
      setProperty(propData);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      if (editingRoom) { await tenantService.updateRoom(editingRoom.id, form); }
      else { await tenantService.createRoom(id, form); }
      setShowForm(false); setEditingRoom(null);
      setForm({ room_type: '', base_price: '', child_price: '', capacity: '', description: '' });
      fetchRooms();
    } catch { alert('Gagal menyimpan kamar'); }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Hapus kamar ini?')) return;
    await tenantService.deleteRoom(roomId);
    fetchRooms();
  };

  const handleOpenAvailModal = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsAvailModalOpen(true);
    try {
      const data = await availabilityService.getRoomAvailability(roomId);
      setAvailabilities(data);
    } catch (_err) {
      console.error('Gagal membuka ketersediaan', _err);
    }
  };

  const handleDayClick = async (date: Date) => {
    if (!selectedRoomId) return;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const dateStr = startOfDay.toISOString();

    const existing = availabilities.find(a => new Date(a.date).getTime() === startOfDay.getTime());
    const newIsAvailable = existing ? !existing.is_available : false;

    try {
      await availabilityService.setRoomAvailability(selectedRoomId, dateStr, newIsAvailable);
      const data = await availabilityService.getRoomAvailability(selectedRoomId);
      setAvailabilities(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const errorMsg = e.response?.data?.message || 'Gagal mengupdate ketersediaan';
      alert(errorMsg);
    }
  };

  const blockedDays = availabilities.filter(a => !a.is_available).map(a => new Date(a.date));

  const handleEdit = (room: RoomWithPeakRates) => {
    setEditingRoom(room);
    setForm({
      room_type: room.room_type,
      base_price: String(room.base_price),
      child_price: room.child_price != null ? String(room.child_price) : '',
      capacity: String(room.capacity),
      description: room.description || ''
    });
    setShowForm(true);
  };

  const inputClass = "w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none";
  const isWholeUnit = ['Villa', 'Rumah'].includes(property?.category?.name || '');

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tenant/properties')} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kamar</h1>
      </div>

      {!isWholeUnit && (
        <button onClick={() => { setShowForm(!showForm); setEditingRoom(null); setForm({ room_type: '', base_price: '', child_price: '', capacity: '', description: '' }); }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <Plus size={16} /> {showForm ? 'Batal' : 'Tambah Kamar'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{editingRoom ? 'Edit Kamar' : 'Kamar Baru'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Kamar</label>
              <input value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })} placeholder="cth. Deluxe Room" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Harga Dewasa/malam (Rp)</label>
              <input type="number" min="0" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} placeholder="500000" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Harga Anak-anak/malam (Rp)</label>
              <input type="number" min="0" value={form.child_price ?? ''} onChange={(e) => setForm({ ...form, child_price: e.target.value })} placeholder="Kosongkan jika = dewasa" className={inputClass} />
              <p className="text-xs text-gray-400 mt-0.5">Bayi selalu gratis</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kapasitas (orang)</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="2" className={inputClass} required />
            </div>
            <div>
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
            rooms.map((r) => <RoomCard key={r.id} room={r} onDelete={handleDelete} onEdit={handleEdit} onOpenAvail={handleOpenAvailModal} />)
          )}
        </div>
      )}

      {/* Avail Modal */}
      {isAvailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Atur Ketersediaan Tanggal</h2>
            <p className="text-sm text-gray-500 mb-4">Klik pada tanggal untuk menandai sebagai <span className="text-red-500 font-bold">Tidak Tersedia</span> (ditandai dengan warna merah).</p>
            <div className="flex justify-center bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <DayPicker
                mode="multiple"
                selected={blockedDays}
                onDayClick={handleDayClick}
                disabled={[{ before: new Date() }]}
                modifiers={{ blocked: blockedDays }}
                modifiersStyles={{
                  blocked: { backgroundColor: '#ef4444', color: 'white' }
                }}
              />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setIsAvailModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
