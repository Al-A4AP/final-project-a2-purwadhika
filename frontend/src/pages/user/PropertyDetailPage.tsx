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
import { usePropertyDetailPageState } from '@/hooks/user/property-detail/usePropertyDetailPageState';
import type { PropertyDetailPageState } from '@/hooks/user/property-detail/usePropertyDetailPageState';
import { ReservationPanel } from '@/components/property/ReservationPanel';

const PropertyDetailPage: FC = () => {
  const page = usePropertyDetailPageState();
  if (page.data.loading) return <PropertyDetailSkeleton />;
  const property = page.data.property;
  if (!property) return null;

  return <PropertyDetailView page={page} property={property} />;
};

const PropertyDetailView: FC<{ page: PropertyDetailPageState; property: PropertyDetail }> = ({ page, property }) => (
  <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${page.isTenant ? 'pb-8' : 'pb-24 lg:pb-8'}`}>
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PropertyBackButton onBack={() => page.navigate(-1)} />
      
      <PropertyGallery
        featuredImageUrl={property.featured_image_url || ''}
        images={property.images || []}
        name={property.name}
      />
      
      <div className={`mt-8 flex flex-col lg:flex-row gap-8 ${page.isTenant ? 'justify-center' : ''}`}>
        <div className={`space-y-10 min-w-0 ${page.isTenant ? 'w-full max-w-4xl' : 'lg:w-2/3'}`}>
          <PropertyInfo
            categoryName={property.category?.name}
            name={property.name}
            address={property.address}
            city={property.city}
            minPrice={property.min_price}
            description={property.description}
            amenities={property.amenities}
            rating={property.rating || 0}
            reviewCount={property.review_count || 0}
            property={property}
          />
          <PropertyRooms page={page} property={property} />
          {!page.isTenant && (
            <>
              <PropertyInlineDatePicker page={page} />
              <PropertyInlineAvailability page={page} />
            </>
          )}
          <PropertyLocationMap
            name={property.name}
            address={property.address}
            city={property.city}
            latitude={property.latitude}
            longitude={property.longitude}
          />
          <PropertyReviews reviews={page.data.reviews} />
        </div>

        {!page.isTenant && (
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-24">
              <ReservationPanel page={page} property={property} />
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Mobile Sticky CTA */}
    {!page.isTenant && (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        <ReservationPanel page={page} property={property} isMobile />
      </div>
    )}
  </div>
);

const PropertyRooms: FC<{ page: PropertyDetailPageState; property: PropertyDetail }> = ({ page, property }) => (
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

export default PropertyDetailPage;
