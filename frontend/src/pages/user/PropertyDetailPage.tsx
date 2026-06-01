import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilterStore } from '@/stores/filterStore';
import { useAuthStore } from '@/stores/authStore';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { PricingCalendarSection } from '@/components/property/PricingCalendarSection';
import { AvailabilityModal } from '@/components/property/AvailabilityModal';
import { getBookingBlockedReason } from './property-detail/propertyDetailAccess';
import { PropertyBackButton } from './property-detail/PropertyBackButton';
import { PropertyDetailSkeleton } from './property-detail/PropertyDetailSkeleton';
import { PropertyRoomsSection } from './property-detail/PropertyRoomsSection';
import { getSelectedRoom } from './property-detail/selectedRoom';
import { usePropertyAvailabilityModal } from './property-detail/usePropertyAvailabilityModal';
import { usePropertyBookingActions } from './property-detail/usePropertyBookingActions';
import { usePropertyDetailData } from './property-detail/usePropertyDetailData';

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const filters = useFilterStore();
  const { isAuthenticated, isTenant, user } = useAuthStore();
  const [checkIn, setCheckIn] = useState(filters.check_in_date || '');
  const [checkOut, setCheckOut] = useState(filters.check_out_date || '');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const goHome = useCallback(() => navigate('/'), [navigate]);
  const data = usePropertyDetailData(id, checkIn, checkOut, goHome);
  const booking = usePropertyBookingActions({ checkIn, checkOut, filters, id, navigate });
  const availability = usePropertyAvailabilityModal();
  const selectRoom = useCallback((roomId: string) => setSelectedRoomId(roomId), []);
  const bookingBlockedReason = getBookingBlockedReason(isAuthenticated, user?.verified_at);
  if (data.loading) return <PropertyDetailSkeleton />;
  const property = data.property;
  if (!property) return null;
  const selectedRoom = getSelectedRoom(property.rooms || [], selectedRoomId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PropertyBackButton onBack={() => navigate(-1)} />

        <PropertyGallery featuredImageUrl={property.featured_image_url || ''} name={property.name} images={property.images} />
        <PropertyInfo categoryName={property.category?.name} name={property.name} address={property.address} city={property.city} minPrice={property.min_price} description={property.description} amenities={property.amenities} />

        {!isTenant && (
          <PricingCalendarSection checkIn={checkIn} checkOut={checkOut} dateError={booking.dateError} selectedRoom={selectedRoom}
            onCheckInChange={(v) => { setCheckIn(v); booking.clearDateError(); }}
            onCheckOutChange={(v) => { setCheckOut(v); booking.clearDateError(); }}
          />
        )}

        <PropertyRoomsSection property={property} checkIn={checkIn} checkOut={checkOut} isTenant={isTenant} selectedRoomId={selectedRoom?.id || null} bookingBlockedReason={bookingBlockedReason} onBooking={booking.handleBooking} onCheckAvail={availability.handleCheckAvail} onSelectRoom={selectRoom} />

        <PropertyReviews reviews={data.reviews} />
      </div>

      <AvailabilityModal isOpen={availability.isAvailModalOpen} roomName={availability.selectedRoomName} blockedDays={availability.blockedDays} onClose={availability.closeAvailabilityModal} />
    </div>
  );
};

export default PropertyDetailPage;
