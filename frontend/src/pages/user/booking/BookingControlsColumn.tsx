import type { FC } from "react";
import { GuestCounter } from "@/components/user/GuestCounter";
import { PaymentMethodSelector } from "@/components/user/PaymentMethodSelector";
import { TravelDetailsCard } from "./TravelDetailsCard";
import type { BookingPageState } from "./bookingTypes";

export const BookingControlsColumn: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="md:col-span-2 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Selesaikan Pemesanan Anda</h1>
    <TravelDetailsCard totals={state.totals!} />
    <GuestCounter guests={state.guests} roomCapacity={state.room!.capacity} onUpdate={state.updateGuest} />
    <PaymentMethodSelector paymentMethod={state.paymentMethod} onChange={state.setPaymentMethod} />
  </div>
);
