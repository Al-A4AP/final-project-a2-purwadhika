import type { FC } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

interface ReservationStepperActionsProps {
  canContinue: boolean;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export const ReservationStepperActions: FC<ReservationStepperActionsProps> = ({
  canContinue,
  currentStep,
  onNext,
  onPrev,
  totalSteps,
}) => (
  <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
    {currentStep > 1 ? <BackButton onClick={onPrev} /> : <div />}
    {currentStep < totalSteps && <NextButton canContinue={canContinue} currentStep={currentStep} totalSteps={totalSteps} onClick={onNext} />}
  </div>
);

const BackButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
  >
    Kembali
  </Button>
);

const NextButton: FC<{ canContinue: boolean; currentStep: number; totalSteps: number; onClick: () => void }> = ({ canContinue, currentStep, totalSteps, onClick }) => {
  const getLabel = () => {
    if (currentStep === 1) return "Lanjut ke Data Tamu";
    if (currentStep === 2) return "Lanjut ke Persetujuan";
    if (currentStep === 3) return "Lanjut ke Pembayaran";
    if (currentStep === totalSteps) return "Konfirmasi Reservasi";
    return "Lanjutkan";
  };
  return (
    <Button
      onClick={onClick}
      disabled={!canContinue}
      variant="danger"
      className="flex items-center justify-center rounded-xl bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
    >
      <span className="truncate">{getLabel()}</span> <ChevronRight className="ml-2 h-5 w-5 shrink-0" />
    </Button>
  );
};
