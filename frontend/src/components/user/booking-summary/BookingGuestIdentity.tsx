import type { FC } from "react";
import type { BookingGuestIdentity as GuestIdentity } from "@/hooks/user/booking/bookingTypes";

export const BookingGuestIdentity: FC<{ identity: GuestIdentity }> = ({ identity }) => (
  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/50">
    <p className="font-semibold text-slate-900 dark:text-white">Data Tamu</p>
    <div className="mt-3 space-y-1 text-slate-600 dark:text-slate-400">
      <p>{identity.legalName}</p>
      <p>{identity.phone}</p>
      <p>{identity.ktpAddress}</p>
    </div>
  </div>
);
