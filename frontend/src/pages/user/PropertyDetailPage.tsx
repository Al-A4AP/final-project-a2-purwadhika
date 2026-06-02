import type { FC } from 'react';
import type { PropertyDetail } from '@/types';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyLocationMap } from '@/components/property/PropertyLocationMap';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { AvailabilityModal } from '@/components/property/AvailabilityModal';
import { PropertyBackButton } from './property-detail/PropertyBackButton';
import { PropertyDetailSkeleton } from './property-detail/PropertyDetailSkeleton';
import { PropertyRoomsSection } from './property-detail/PropertyRoomsSection';
import { usePropertyDetailPageState } from './property-detail/usePropertyDetailPageState';

const PropertyDetailPage: FC = () => {
  const page = usePropertyDetailPageState();
  if (page.data.loading) return <PropertyDetailSkeleton />;
  const property = page.data.property;
  if (!property) return null;

  return <PropertyDetailView page={page} property={property} />;
};

const PropertyDetailView: FC<PropertyDetailViewProps> = ({ page, property }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
    <PropertyDetailMain page={page} property={property} />
    <PropertyDetailAvailabilityModal page={page} />
  </div>
);

const PropertyDetailMain: FC<PropertyDetailViewProps> = ({ page, property }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <PropertyBackButton onBack={() => page.navigate(-1)} />
    <PropertyGallery featuredImageUrl={property.featured_image_url || ''} name={property.name} images={property.images} />
    <PropertyInfo categoryName={property.category?.name} name={property.name} address={property.address} city={property.city} minPrice={property.min_price} description={property.description} amenities={property.amenities} />
    <PropertyLocationMap name={property.name} address={property.address} city={property.city} latitude={property.latitude} longitude={property.longitude} />
    <PropertyRooms page={page} property={property} />
    <PropertyReviews reviews={page.data.reviews} />
  </div>
);

const PropertyRooms: FC<PropertyDetailViewProps> = ({ page, property }) => (
  <PropertyRoomsSection property={property} checkIn={page.checkIn} checkOut={page.checkOut} isTenant={page.isTenant}
    selectedRoomId={page.selectedRoom?.id || null} bookingBlockedReason={page.bookingBlockedReason}
    onBooking={page.handleRoomBooking} onCheckAvail={page.openAvailability} onSelectRoom={page.selectRoom}
  />
);

const PropertyDetailAvailabilityModal: FC<{ page: PropertyDetailPageState }> = ({ page }) => (
  <AvailabilityModal isOpen={page.availability.isAvailModalOpen} room={page.modalRoom} checkIn={page.checkIn}
    checkOut={page.checkOut} dateError={page.booking.dateError} bookingBlockedReason={page.bookingBlockedReason}
    onCheckInChange={page.changeCheckIn} onCheckOutChange={page.changeCheckOut} onBook={page.booking.bookRoom}
    onClose={page.availability.closeAvailabilityModal}
  />
);

interface PropertyDetailViewProps {
  page: PropertyDetailPageState;
  property: PropertyDetail;
}

type PropertyDetailPageState = ReturnType<typeof usePropertyDetailPageState>;

export default PropertyDetailPage;
