import type { FC } from "react";
import { Check } from "lucide-react";
import type { ReservationStep } from "./reservationSteps";

interface ReservationStepIndicatorProps {
  currentStep: number;
  steps: ReservationStep[];
  totalSteps: number;
}

export const ReservationStepIndicator: FC<ReservationStepIndicatorProps> = (props) => (
  <>
    <DesktopStepper {...props} />
    <MobileStepper {...props} />
  </>
);

const DesktopStepper: FC<ReservationStepIndicatorProps> = ({ currentStep, steps }) => (
  <div className="mb-8 hidden md:block">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <DesktopStep key={step.id} currentStep={currentStep} step={step} hasLine={index < steps.length - 1} />
      ))}
    </div>
  </div>
);

const DesktopStep: FC<{ currentStep: number; hasLine: boolean; step: ReservationStep }> = ({
  currentStep,
  hasLine,
  step,
}) => (
  <div className="flex flex-1 items-center">
    <StepCircle currentStep={currentStep} step={step} />
    {hasLine && <StepLine active={currentStep > step.id} />}
  </div>
);

const StepCircle: FC<{ currentStep: number; step: ReservationStep }> = ({ currentStep, step }) => (
  <div className="flex flex-col items-center">
    <div className={getCircleClass(currentStep, step.id)}>
      {currentStep > step.id ? <Check size={20} /> : step.id}
    </div>
    <span className={getStepLabelClass(currentStep, step.id)}>{step.title}</span>
  </div>
);

const StepLine: FC<{ active: boolean }> = ({ active }) => (
  <div className={`mx-4 h-1 flex-1 rounded-full ${active ? "bg-green-500" : "bg-slate-200 dark:bg-slate-800"}`} />
);

const MobileStepper: FC<ReservationStepIndicatorProps> = ({ currentStep, steps, totalSteps }) => (
  <div className="mb-6 md:hidden">
    <p className="text-sm font-semibold text-red-600">Langkah {currentStep} dari {totalSteps}</p>
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      {steps.find((step) => step.id === currentStep)?.title}
    </h2>
    <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
      <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
    </div>
  </div>
);

const getCircleClass = (currentStep: number, stepId: number) => {
  if (currentStep > stepId) return "flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white transition-colors";
  if (currentStep === stepId) return "flex h-10 w-10 items-center justify-center rounded-full bg-red-600 font-bold text-white ring-4 ring-red-100 transition-colors dark:ring-red-900/30";
  return "flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500 transition-colors dark:bg-slate-800";
};

const getStepLabelClass = (currentStep: number, stepId: number) =>
  `mt-2 text-xs font-semibold ${currentStep >= stepId ? "text-slate-900 dark:text-white" : "text-slate-400"}`;
