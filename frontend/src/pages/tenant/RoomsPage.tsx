import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { availabilityService, type RoomAvailability } from '@/services/availabilityService';
import type { RoomWithPeakRates, PeakSeasonRate, RoomFormInput, TenantPropertyDetail } from '@/types';
import { toast } from 'react-hot-toast';

import { RoomCard } from '@/components/tenant/RoomCard';
import { RoomForm } from '@/components/tenant/RoomForm';
import { RoomAvailabilityModal } from '@/components/tenant/RoomAvailabilityModal';
import { RoomPeakRatesModal } from '@/components/tenant/RoomPeakRatesModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';

const RoomsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomWithPeakRates[]>([]);
  const [property, setProperty] = useState<TenantPropertyDetail | null>(null);
  const [availabilities, setAvailabilities] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [isPeakModalOpen, setIsPeakModalOpen] = useState(false);
  const [peakRates, setPeakRates] = useState<PeakSeasonRate[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomWithPeakRates | null>(null);
  const [form, setForm] = useState<RoomFormInput>({ room_type: '', base_price: '', child_price: '', capacity: '', description: '' });
  const [peakForm, setPeakForm] = useState({
    start_date: '',
    end_date: '',
    rate_type: 'PERCENTAGE',
    rate_value: '',
    description: ''
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const fetchRooms = useCallback(() => {
    if (!id) return;
    Promise.all([
      tenantService.getRooms(id),
      tenantService.getProperty(id)
    ]).then(([roomsData, propData]) => {
      setRooms(roomsData);
      setProperty(propData);
    }).catch((err) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Properti tidak ditemukan atau Anda tidak memiliki akses');
      navigate('/tenant/properties');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      if (editingRoom) {
        await tenantService.updateRoom(editingRoom.id, form);
        toast.success('Kamar berhasil diperbarui!');
      } else {
        await tenantService.createRoom(id, form);
        toast.success('Kamar baru berhasil ditambahkan!');
      }
      setShowForm(false);
      setEditingRoom(null);
      setForm({ room_type: '', base_price: '', child_price: '', capacity: '', description: '' });
      fetchRooms();
    } catch {
      toast.error('Gagal menyimpan kamar');
    }
  };

  const handleDelete = (roomId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Kamar',
      message: 'Apakah Anda yakin ingin menghapus kamar ini? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: async () => {
        try {
          await tenantService.deleteRoom(roomId);
          toast.success('Kamar berhasil dihapus');
          fetchRooms();
        } catch {
          toast.error('Gagal menghapus kamar');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleOpenAvailModal = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsAvailModalOpen(true);
    try {
      const data = await availabilityService.getRoomAvailability(roomId);
      setAvailabilities(data);
    } catch {
      toast.error('Gagal memuat ketersediaan kamar');
    }
  };

  const handleOpenPeakModal = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsPeakModalOpen(true);
    setPeakForm({ start_date: '', end_date: '', rate_type: 'PERCENTAGE', rate_value: '', description: '' });
    try {
      const data = await tenantService.getPeakRates(roomId);
      setPeakRates(data);
    } catch {
      toast.error('Gagal memuat aturan peak season');
    }
  };

  const handleAddPeakRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    try {
      await tenantService.createPeakRate(selectedRoomId, peakForm);
      const data = await tenantService.getPeakRates(selectedRoomId);
      setPeakRates(data);
      setPeakForm({ start_date: '', end_date: '', rate_type: 'PERCENTAGE', rate_value: '', description: '' });
      toast.success('Peak rate berhasil ditambahkan!');
      fetchRooms();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Gagal menambahkan peak rate');
    }
  };

  const handleDeletePeakRate = (rateId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Peak Rate',
      message: 'Apakah Anda yakin ingin menghapus aturan peak rate ini?',
      onConfirm: async () => {
        try {
          await tenantService.deletePeakRate(rateId);
          if (selectedRoomId) {
            const data = await tenantService.getPeakRates(selectedRoomId);
            setPeakRates(data);
          }
          toast.success('Peak rate berhasil dihapus');
          fetchRooms();
        } catch {
          toast.error('Gagal menghapus peak rate');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
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
      toast.success('Status ketersediaan tanggal berhasil diubah');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const errorMsg = e.response?.data?.message || 'Gagal mengupdate ketersediaan';
      toast.error(errorMsg);
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
        <RoomForm
          isEditing={!!editingRoom}
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? <div className="h-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-xl" /> : (
        <div className="space-y-3">
          {rooms.length === 0 ? <p className="text-gray-500 text-sm">Belum ada kamar. Tambahkan kamar pertama.</p> : (
            rooms.map((r) => (
              <RoomCard 
                key={r.id} 
                room={r} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
                onOpenAvail={handleOpenAvailModal}
                onOpenPeakRates={handleOpenPeakModal}
              />
            ))
          )}
        </div>
      )}

      {/* Avail Modal */}
      <RoomAvailabilityModal
        isOpen={isAvailModalOpen}
        blockedDays={blockedDays}
        onDayClick={handleDayClick}
        onClose={() => setIsAvailModalOpen(false)}
      />

      {/* Peak Rates Modal */}
      <RoomPeakRatesModal
        isOpen={isPeakModalOpen}
        peakRates={peakRates}
        peakForm={peakForm}
        onFormChange={setPeakForm}
        onAddRate={handleAddPeakRate}
        onDeleteRate={handleDeletePeakRate}
        onClose={() => setIsPeakModalOpen(false)}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default RoomsPage;
