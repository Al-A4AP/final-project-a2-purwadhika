import type { FC } from 'react';
import type { PropertyDetail } from '@/types';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyLocationMap } from '@/components/property/PropertyLocationMap';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { InlineDatePicker } from '@/components/property/InlineDatePicker';
import { InlineAvailabilitySection } from '@/components/property/InlineAvailabilitySection';
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
  </div>
);

/**
 * Layout order (revised):
 * 1. Gallery (carousel)
 * 2. Property info (name, location, amenities, description)
 * 3. Room selection
 * 4. Date picker + availability calendar (inline, linked to selected room)
 * 5. Location map
 * 6. Guest reviews
 */
const PropertyDetailMain: FC<PropertyDetailViewProps> = ({ page, property }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <PropertyBackButton onBack={() => page.navigate(-1)} />
    <PropertyGallery
      featuredImageUrl={property.featured_image_url || ''}
      name={property.name}
      images={property.images}
    />
    <PropertyInfo
      categoryName={property.category?.name}
      name={property.name}
      address={property.address}
      city={property.city}
      minPrice={property.min_price}
      description={property.description}
      amenities={property.amenities}
    />
    <PropertyRooms page={page} property={property} />
    <PropertyInlineDatePicker page={page} />
    <PropertyInlineAvailability page={page} />
    <PropertyLocationMap
      name={property.name}
      address={property.address}
      city={property.city}
      latitude={property.latitude}
      longitude={property.longitude}
    />
    <PropertyReviews reviews={page.data.reviews} />
  </div>
);

const PropertyRooms: FC<PropertyDetailViewProps> = ({ page, property }) => (
  <PropertyRoomsSection
    property={property}
    checkIn={page.checkIn}
    checkOut={page.checkOut}
    isTenant={page.isTenant}
    selectedRoomId={page.selectedRoom?.id || null}
    bookingBlockedReason={page.bookingBlockedReason}
    onBooking={page.handleRoomBooking}
    onSelectRoom={page.selectRoom}
  />
);

const PropertyInlineDatePicker: FC<{ page: PropertyDetailPageState }> = ({ page }) => (
  <InlineDatePicker
    checkIn={page.checkIn}
    checkOut={page.checkOut}
    dateError={page.booking.dateError}
    onCheckInChange={page.changeCheckIn}
    onCheckOutChange={page.changeCheckOut}
  />
);

const PropertyInlineAvailability: FC<{ page: PropertyDetailPageState }> = ({ page }) => (
  <InlineAvailabilitySection
    room={page.selectedRoom || null}
    checkIn={page.checkIn}
    checkOut={page.checkOut}
    onCheckInChange={page.changeCheckIn}
    onCheckOutChange={page.changeCheckOut}
  />
);

interface PropertyDetailViewProps {
  page: PropertyDetailPageState;
  property: PropertyDetail;
}

type PropertyDetailPageState = ReturnType<typeof usePropertyDetailPageState>;

export default PropertyDetailPage;
