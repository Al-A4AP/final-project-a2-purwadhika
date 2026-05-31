import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { getApiErrorMessage } from '@/lib/errorMessage';
import { useFilterStore } from '@/stores/filterStore';
import { reviewService } from '@/services/reviewService';
import { availabilityService } from '@/services/availabilityService';
import type { PropertyDetail, Room, Review } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { PricingCalendarSection } from '@/components/property/PricingCalendarSection';
import { AvailabilityModal } from '@/components/property/AvailabilityModal';
import { RoomCard } from '@/components/property/RoomCard';
import { BookingAccessNotice } from '@/components/property/BookingAccessNotice';
import { WholeUnitCard } from '@/components/property/WholeUnitCard';

const formatDateToUTC = (localDateStr: string) => {
  const parts = localDateStr.split('-');
  if (parts.length !== 3) return '';
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const validateBookingDates = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return { message: 'Silakan pilih tanggal check-in dan check-out terlebih dahulu.', focusDate: true };
  const ciUTC = formatDateToUTC(checkIn);
  const coUTC = formatDateToUTC(checkOut);
  if (ciUTC < new Date().toISOString().split('T')[0]) return { message: 'Tanggal check-in tidak boleh di masa lalu.' };
  if (coUTC <= ciUTC) return { message: 'Tanggal check-out harus setelah check-in.' };
  return { ciUTC, coUTC };
};

const focusDatePicker = () => {
  document.getElementById('date-picker-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const filters = useFilterStore();
  const { isAuthenticated, isTenant, user } = useAuthStore();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(filters.check_in_date || '');
  const [checkOut, setCheckOut] = useState(filters.check_out_date || '');
  const [dateError, setDateError] = useState('');
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);
  const bookingBlockedReason = !isAuthenticated
    ? 'Login dan verifikasi email diperlukan sebelum membuat pesanan.'
    : !user?.verified_at ? 'Silakan verifikasi email Anda sebelum membuat pesanan.' : undefined;

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
    const result = validateBookingDates(checkIn, checkOut);
    if (result.message) {
      setDateError(result.message);
      if (result.focusDate) focusDatePicker();
      return;
    }
    if (!result.ciUTC || !result.coUTC) return focusDatePicker();
    filters.setCheckInDate(checkIn);
    filters.setCheckOutDate(checkOut);
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${result.ciUTC}&checkOut=${result.coUTC}`);
  };

  const handleCheckAvail = async (room: Room) => {
    setSelectedRoomName(room.room_type);
    try {
      const data = await availabilityService.getRoomAvailability(room.id);
      setBlockedDays(data.filter((a) => !a.is_available).map((a) => new Date(a.date)));
      setIsAvailModalOpen(true);
    } catch (err) { toast.error(getApiErrorMessage(err, 'Ketersediaan kamar belum bisa dimuat. Coba lagi beberapa saat.')); }
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
        <PropertyInfo categoryName={property.category?.name} name={property.name} address={property.address} city={property.city} minPrice={property.min_price} description={property.description} amenities={property.amenities} />

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
          <>
            <BookingAccessNotice message={!isTenant ? bookingBlockedReason : undefined} />
            <WholeUnitCard room={firstRoom} amenities={property.amenities} isTenant={isTenant} bookingBlockedReason={bookingBlockedReason} onBooking={handleBooking} onCheckAvail={handleCheckAvail} categoryName={property.category?.name || ''} />
          </>
        ) : (
          <>
            <BookingAccessNotice message={!isTenant ? bookingBlockedReason : undefined} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pilihan Kamar</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.rooms?.map((room) => (
                <RoomCard key={room.id} room={room} amenities={property.amenities} isTenant={isTenant} bookingBlockedReason={bookingBlockedReason} onBooking={handleBooking} onCheckAvail={handleCheckAvail} />
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

export default PropertyDetailPage;
