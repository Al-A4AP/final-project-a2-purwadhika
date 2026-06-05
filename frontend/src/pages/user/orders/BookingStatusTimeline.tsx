import type { FC } from "react";
import type { OrderStatus } from "@/types";
import { Check, Clock, X } from "lucide-react";

export const BookingStatusTimeline: FC<{ status: OrderStatus }> = ({ status }) => {
  const isCancelled = status === "CANCELLED";
  
  const steps = [
    { id: "WAITING_PAYMENT", label: "Menunggu Pembayaran" },
    { id: "WAITING_CONFIRMATION", label: "Menunggu Konfirmasi" },
    { id: "PROCESSED", label: "Dikonfirmasi" },
    { id: "COMPLETED", label: "Selesai" }
  ];

  const currentIndex = isCancelled ? -1 : steps.findIndex(s => s.id === status);
  const getStepStatus = (index: number) => {
    if (isCancelled) return "cancelled";
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Status Perjalanan</h2>
      <div className="relative">
        <div className="absolute left-4.75 top-2 bottom-2 w-1 bg-slate-100 dark:bg-slate-800 md:left-2 md:right-2 md:top-4.75 md:bottom-auto md:h-1 md:w-auto" />
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between relative z-10">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            return (
              <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white dark:border-slate-900 transition-colors
                  ${stepStatus === "completed" ? "bg-green-500 text-white" : 
                    stepStatus === "current" ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30" : 
                    stepStatus === "cancelled" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-400 dark:bg-slate-800"}`}
                >
                  {stepStatus === "completed" ? <Check size={18} /> : 
                   stepStatus === "cancelled" ? <X size={18} /> : 
                   <Clock size={18} />}
                </div>
                <div className="md:text-center">
                  <p className={`text-sm font-bold ${stepStatus === "current" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
