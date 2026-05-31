import type { FC } from "react";
import { HelpText } from "@/components/common/HelpText";
import { GuestCounter } from "@/components/user/GuestCounter";
import { PaymentMethodSelector } from "@/components/user/PaymentMethodSelector";
import { TravelDetailsCard } from "./TravelDetailsCard";
import type { BookingPageState } from "./bookingTypes";

export const BookingControlsColumn: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="md:col-span-2 space-y-6">
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Selesaikan Pemesanan Anda</h1>
      <HelpText>Pastikan tanggal, jumlah tamu, dan metode pembayaran sudah sesuai sebelum melanjutkan.</HelpText>
    </div>
    <TravelDetailsCard totals={state.totals!} />
    <GuestCounter guests={state.guests} roomCapacity={state.room!.capacity} onUpdate={state.updateGuest} />
    <PaymentMethodSelector paymentMethod={state.paymentMethod} onChange={state.setPaymentMethod} />
  </div>
);
