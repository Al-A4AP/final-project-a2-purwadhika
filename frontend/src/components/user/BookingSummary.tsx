import type { FC } from 'react';
import { BookingPriceBreakdown } from './booking-summary/BookingPriceBreakdown';
import { BookingPropertyPreview } from './booking-summary/BookingPropertyPreview';
import { BookingTotal } from './booking-summary/BookingTotal';
import { CheckoutButton } from './booking-summary/CheckoutButton';
import type { BookingSummaryProps } from './booking-summary/types';

export const BookingSummary: FC<BookingSummaryProps> = (props) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700 sticky top-24">
    <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Ringkasan Pesanan</h2>
    <BookingPropertyPreview property={props.property} room={props.room} />
    <BookingPriceBreakdown guests={props.guests} nights={props.nights} room={props.room} totalRoomPrice={props.totalRoomPrice} />
    <BookingTotal totalPrice={props.totalPrice} />
    <CheckoutButton processing={props.processing} onCheckout={props.onCheckout} />
  </div>
);
