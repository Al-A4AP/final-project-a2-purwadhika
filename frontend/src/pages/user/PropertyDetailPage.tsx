import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { useFilterStore } from '@/stores/filterStore';
import { reviewService } from '@/services/reviewService';
import { availabilityService } from '@/services/availabilityService';
import type { PropertyDetail, Room, Review } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeft, AlertTriangle, BedDouble, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/formatters';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { PricingCalendarSection } from '@/components/property/PricingCalendarSection';
import { AvailabilityModal } from '@/components/property/AvailabilityModal';
import { RoomCard } from '@/components/property/RoomCard';

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const filters = useFilterStore();
  const { isTenant } = useAuthStore();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(filters.check_in_date || '');
  const [checkOut, setCheckOut] = useState(filters.check_out_date || '');
  const [dateError, setDateError] = useState('');
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);

  const formatDateToUTC = (localDateStr: string): string => {
    const parts = localDateStr.split('-');
    if (parts.length !== 3) return '';
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
  };


  useEffect(() => {
    if (!id) { navigate('/'); return; }
    const hasValidDates = checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
    Promise.resolve().then(() => setLoading(true));
    Promise.all([
      propertyService.getPropertyDetail(id, hasValidDates ? checkIn : undefined, hasValidDates ? checkOut : undefined),
      reviewService.getPropertyReviews(id),
    ])
      .then(([propData, reviewData]) => { setProperty(propData); setReviews(reviewData); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate, checkIn, checkOut]);

  const handleBooking = (room: Room) => {
    setDateError('');
    if (!checkIn || !checkOut) {
      setDateError('Silakan pilih tanggal check-in dan check-out terlebih dahulu.');
      document.getElementById('date-picker-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const ciUTC = formatDateToUTC(checkIn);
    const todayStr = new Date().toISOString().split('T')[0];
    if (ciUTC < todayStr) { setDateError('Tanggal check-in tidak boleh di masa lalu.'); return; }
    const coUTC = formatDateToUTC(checkOut);
    if (coUTC <= ciUTC) { setDateError('Tanggal check-out harus setelah check-in.'); return; }
    filters.setCheckInDate(checkIn);
    filters.setCheckOutDate(checkOut);
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${ciUTC}&checkOut=${coUTC}`);
  };

  const handleCheckAvail = async (room: Room) => {
    setSelectedRoomName(room.room_type);
    try {
      const data = await availabilityService.getRoomAvailability(room.id);
      setBlockedDays(data.filter((a) => !a.is_available).map((a) => new Date(a.date)));
      setIsAvailModalOpen(true);
    } catch { toast.error('Gagal mengambil data ketersediaan'); }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-10 w-1/3 bg-gray-200 dark:bg-slate-800 rounded"></div>
      <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
  );
  if (!property) return null;

  const isWholeUnit = ['Villa', 'Rumah'].includes(property.category?.name || '');
  const firstRoom = property.rooms?.[0];
  const noRooms = checkIn && checkOut && (!property.rooms || property.rooms.length === 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6 hover:text-red-600">
          <ArrowLeft size={20} /> Kembali
        </button>

        <PropertyGallery featuredImageUrl={property.featured_image_url || ''} name={property.name} images={property.images} />
        <PropertyInfo categoryName={property.category?.name} name={property.name} address={property.address} city={property.city} minPrice={property.min_price} description={property.description} />

        {!isTenant && (
          <PricingCalendarSection checkIn={checkIn} checkOut={checkOut} dateError={dateError} rooms={property.rooms || []}
            onCheckInChange={(v) => { setCheckIn(v); setDateError(''); }}
            onCheckOutChange={(v) => { setCheckOut(v); setDateError(''); }}
          />
        )}

        {noRooms ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center text-red-600 dark:text-red-400">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Unit Tidak Tersedia</h2>
            <p>Maaf, properti ini tidak memiliki kamar yang tersedia pada tanggal yang Anda pilih. Silakan ubah rentang tanggal check-in dan check-out Anda.</p>
          </div>
        ) : isWholeUnit && firstRoom ? (
          <WholeUnitCard room={firstRoom} isTenant={isTenant} onBooking={handleBooking} onCheckAvail={handleCheckAvail} categoryName={property.category?.name || ''} />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pilihan Kamar</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.rooms?.map((room) => (
                <RoomCard key={room.id} room={room} isTenant={isTenant} onBooking={handleBooking} onCheckAvail={handleCheckAvail} />
              ))}
            </div>
          </>
        )}

        <PropertyReviews reviews={reviews} />
      </div>

      <AvailabilityModal isOpen={isAvailModalOpen} roomName={selectedRoomName} blockedDays={blockedDays} onClose={() => setIsAvailModalOpen(false)} />
    </div>
  );
};

/* Whole-unit card for Villa / Rumah */
const WholeUnitCard: FC<{ room: Room; isTenant: boolean; categoryName: string; onBooking: (r: Room) => void; onCheckAvail: (r: Room) => void }> = ({ room, isTenant, categoryName, onBooking, onCheckAvail }) => {
  const price = room.priceDetails ? room.priceDetails.totalPrice : room.base_price;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{categoryName === 'Villa' ? 'Sewa Seluruh Villa' : 'Sewa Seluruh Rumah'}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Anda akan menyewa seluruh {categoryName?.toLowerCase()} ini secara eksklusif.</p>
      <div className="flex flex-wrap gap-6 items-center justify-between">
        <div className="space-y-1">
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><BedDouble size={16} /> Kapasitas: {room.capacity} orang</span>
          {room.description && <p className="text-sm text-gray-500">{room.description}</p>}
        </div>
        <div className="text-right">
          {price === 0 ? <p className="text-3xl font-bold text-green-600">Gratis</p> : <p className="text-3xl font-bold text-red-600">{formatPrice(price)}</p>}
          <p className="text-sm text-gray-500">{room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam (seluruh unit)'}</p>
        </div>
      </div>
      {room.is_available === false && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-1.5">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
        </div>
      )}
      {!isTenant && (
        <div className="flex gap-3 mt-6 border-t dark:border-slate-700 pt-6">
          <button onClick={() => onCheckAvail(room)} className="flex items-center gap-2 px-4 py-2.5 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm">
            <CalendarIcon size={16} /> Cek Ketersediaan
          </button>
          <button onClick={() => onBooking(room)} disabled={room.is_available === false}
            className={`flex-1 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm ${room.is_available === false ? 'bg-gray-400 dark:bg-slate-700 cursor-not-allowed text-gray-200' : 'bg-red-600 hover:bg-red-700'}`}>
            {room.is_available === false ? 'Tidak Tersedia' : 'Pesan Sekarang'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
