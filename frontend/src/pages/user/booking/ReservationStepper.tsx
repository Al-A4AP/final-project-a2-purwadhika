import { useState } from "react";
import type { FC } from "react";
import { toast } from "react-hot-toast";
import { Check, ChevronRight, UploadCloud } from "lucide-react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";
import { TravelDetailsCard } from "./TravelDetailsCard";
import { GuestCounter } from "@/components/user/GuestCounter";
import { PaymentMethodSelector } from "@/components/user/PaymentMethodSelector";
import { BookingSummary } from "@/components/user/BookingSummary";

interface ReservationStepperProps {
  state: BookingPageState;
}

export const ReservationStepper: FC<ReservationStepperProps> = ({ state }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const isManual = state.paymentMethod === "MANUAL";
  const totalSteps = isManual ? 5 : 4;

  const steps = [
    { id: 1, title: "Detail Menginap" },
    { id: 2, title: "Data Tamu" },
    { id: 3, title: "Pembayaran" },
    ...(isManual ? [{ id: 4, title: "Bukti Transfer" }] : []),
    { id: isManual ? 5 : 4, title: "Tinjau Reservasi" },
  ];

  const handleNext = () => setCurrentStep((p) => Math.min(p + 1, totalSteps));
  const handlePrev = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const submitBooking = () => state.handleCheckout(proofFile);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-900/30' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </div>
                <span className={`mt-2 text-xs font-semibold ${currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`mx-4 h-1 flex-1 rounded-full ${currentStep > step.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stepper Status */}
      <div className="mb-6 md:hidden">
        <p className="text-sm font-semibold text-red-600">Langkah {currentStep} dari {totalSteps}</p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{steps.find(s => s.id === currentStep)?.title}</h2>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detail Perjalanan</h2>
              <p className="text-sm text-slate-500">Periksa kembali tanggal check-in dan check-out Anda.</p>
            </div>
            <TravelDetailsCard dateForm={state.dateForm} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Jumlah Tamu</h2>
              <p className="text-sm text-slate-500">Sesuaikan jumlah tamu dengan kapasitas kamar.</p>
            </div>
            <GuestCounter guests={state.guests} roomCapacity={state.room!.capacity} onUpdate={state.updateGuest} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Metode Pembayaran</h2>
              <p className="text-sm text-slate-500">Pilih metode pembayaran yang paling nyaman untuk Anda.</p>
            </div>
            <PaymentMethodSelector paymentMethod={state.paymentMethod} onChange={state.setPaymentMethod} />
          </div>
        )}

        {isManual && currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Unggah Bukti Transfer</h2>
              <p className="text-sm text-slate-500">Format gambar yang didukung: JPG, PNG. Maksimal 1MB.</p>
            </div>
            
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500 dark:hover:bg-red-900/10">
              {proofFile ? (
                <>
                  <div className="mb-4 h-32 w-24 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
                    <img src={URL.createObjectURL(proofFile)} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">{proofFile.name}</p>
                  <p className="text-sm text-slate-500 mt-1">Klik untuk mengganti gambar</p>
                </>
              ) : (
                <>
                  <UploadCloud className="mb-4 h-12 w-12 text-slate-400" />
                  <p className="font-semibold text-slate-900 dark:text-white">Pilih atau letakkan gambar di sini</p>
                </>
              )}
              <input type="file" accept="image/jpeg, image/png" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 1 * 1024 * 1024) {
                    toast.error("Ukuran gambar tidak boleh melebihi 1MB");
                    e.target.value = '';
                    return;
                  }
                  setProofFile(file);
                }
              }} className="hidden" />
            </label>
            {!proofFile && <p className="text-xs text-red-500 text-center">* Bukti transfer wajib diunggah untuk melanjutkan.</p>}
          </div>
        )}

        {currentStep === totalSteps && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <BookingSummary 
              property={state.property!} 
              room={state.room!} 
              nights={state.totals!.nights} 
              guests={state.guests} 
              totalPrice={state.totals!.totalPrice} 
              totalRoomPrice={state.totals!.totalRoomPrice} 
              processing={state.processing} 
              onCheckout={submitBooking} 
            />
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          {currentStep > 1 ? (
            <button onClick={handlePrev} className="rounded-xl px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Kembali
            </button>
          ) : <div />}
          
          {currentStep < totalSteps && (
            <button 
              onClick={handleNext} 
              disabled={currentStep === 4 && isManual && !proofFile}
              className="flex items-center justify-center rounded-xl bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              Lanjutkan <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
