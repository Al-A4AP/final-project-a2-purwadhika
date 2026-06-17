import type { FC } from "react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";
import { BookingSummary } from "@/components/user/BookingSummary";
import { GuestCounter } from "@/components/user/GuestCounter";
import { PaymentMethodSelector } from "@/components/user/PaymentMethodSelector";
import { TravelDetailsCard } from "./TravelDetailsCard";
import { AgreementStep } from "./AgreementStep";
import { GuestIdentityForm } from "./GuestIdentityForm";
import { ManualProofUpload, StepIntro } from "./ManualProofUpload";
import { VoucherCodeBox } from "./VoucherCodeBox";
import {
  IncompleteProfileNotice,
} from "@/components/user/booking-summary/IncompleteProfileNotice";
import { isProfileIncomplete } from "@/components/user/booking-summary/profileCompleteness";

interface ReservationStepContentProps {
  currentStep: number;
  isManual: boolean;
  proofFile: File | null;
  state: BookingPageState;
  totalSteps: number;
  onProofFileChange: (file: File | null) => void;
}

export const ReservationStepContent: FC<ReservationStepContentProps> = (
  props,
) => (
  <>
    {props.currentStep === 1 && <TravelStep state={props.state} />}
    {props.currentStep === 2 && <GuestStep state={props.state} />}
    {props.currentStep === 3 && <AgreementReviewStep state={props.state} />}
    {props.currentStep === 4 && <PaymentStep state={props.state} />}
    {props.isManual && props.currentStep === 5 && (
      <ManualProofUpload {...props} />
    )}
    {props.currentStep === props.totalSteps && <SummaryStep {...props} />}
  </>
);

const TravelStep: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <StepIntro
      title="Detail Menginap"
      description="Periksa kembali tanggal check-in dan check-out Anda."
    />
    <TravelDetailsCard dateForm={state.dateForm} />
  </div>
);
const GuestStep: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <StepIntro
      title="Data Tamu"
      description="Lengkapi data sesuai identitas resmi untuk kelancaran proses check-in."
    />
    {isProfileIncomplete(state.guestIdentity) && <IncompleteProfileNotice />}
    <GuestIdentityForm state={state} />
    <GuestCounter
      guests={state.guests}
      roomCapacity={state.room!.capacity}
      onUpdate={state.updateGuest}
    />
  </div>
);

const AgreementReviewStep: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <StepIntro
      title="Tinjauan & Persetujuan"
      description="Pastikan detail reservasi sudah benar sebelum memilih pembayaran."
    />
    <VoucherCodeBox state={state} />
    <AgreementStep state={state} />
  </div>
);

const PaymentStep: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    {isFreeReservation(state) ? (
      <FreeReservationNotice />
    ) : (
      <PaymentSelection state={state} />
    )}
  </div>
);

const SummaryStep: FC<ReservationStepContentProps> = ({ proofFile, state }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <BookingSummary
      guestIdentity={state.guestIdentity}
      property={state.property!}
      room={state.room!}
      nights={state.totals!.nights}
      guests={state.guests}
      discountAmount={state.voucherPreview?.discountAmount}
      voucher={state.voucherPreview?.voucher}
      totalPrice={state.totals!.totalPrice}
      totalRoomPrice={state.totals!.totalRoomPrice}
      processing={state.processing}
      onCheckout={() => state.handleCheckout(proofFile)}
    />
  </div>
);

const PaymentSelection: FC<{ state: BookingPageState }> = ({ state }) => (
  <>
    <StepIntro
      title="Pembayaran & Konfirmasi"
      description="Selesaikan pembayaran atau unggah bukti transfer dalam 1 jam agar reservasi tidak otomatis dibatalkan."
    />
    <PaymentMethodSelector
      paymentMethod={state.paymentMethod}
      onChange={state.setPaymentMethod}
    />
  </>
);

const FreeReservationNotice = () => (
  <StepIntro
    title="Konfirmasi Reservasi"
    description="Voucher menutup seluruh biaya menginap. Tidak ada pembayaran yang perlu diselesaikan."
  />
);

const isFreeReservation = (state: BookingPageState) =>
  Boolean(
    state.totals &&
    state.totals.totalPrice - (state.voucherPreview?.discountAmount || 0) <= 0,
  );
