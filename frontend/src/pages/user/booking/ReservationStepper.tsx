import { useState } from "react";
import type { FC } from "react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";
import { buildReservationSteps } from "./reservationSteps";
import { ReservationStepContent } from "./ReservationStepContent";
import { ReservationStepIndicator } from "./ReservationStepIndicator";
import { ReservationStepperActions } from "./ReservationStepperActions";

interface ReservationStepperProps {
  state: BookingPageState;
}

export const ReservationStepper: FC<ReservationStepperProps> = ({ state }) => {
  const [proofFile, setProofFile] = useState<File | null>(null);

  const isManual = state.paymentMethod === "MANUAL";
  const totalSteps = isManual ? 6 : 5;
  const steps = buildReservationSteps(isManual);
  const canContinue = canContinueStep(state.currentStep, isManual, proofFile, state) && !state.processing;
  const handleNext = async () => {
    if (state.currentStep === 3 && !await state.createPendingOrder()) return;
    state.setCurrentStep((step) => Math.min(step + 1, totalSteps));
  };
  const handlePrev = () => state.setCurrentStep((step) => Math.max(step - 1, 1));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <ReservationStepIndicator currentStep={state.currentStep} steps={steps} totalSteps={totalSteps} />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <ReservationStepContent
          currentStep={state.currentStep}
          isManual={isManual}
          proofFile={proofFile}
          state={state}
          totalSteps={totalSteps}
          onProofFileChange={setProofFile}
        />
        <ReservationStepperActions
          canContinue={canContinue}
          currentStep={state.currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
};

const canContinueStep = (step: number, isManual: boolean, proofFile: File | null, state: BookingPageState) => {
  if (step === 2) {
    const { phone, legalName, ktpAddress, ktpNumber } = state.guestIdentity;
    if (!phone.trim() || !legalName.trim() || !ktpAddress.trim() || !ktpNumber.trim() || ktpNumber.trim().length !== 16) return false;
  }
  if (step === 3) return state.agreementAccepted;
  if (step === 5 && isManual) return Boolean(proofFile);
  return true;
};
