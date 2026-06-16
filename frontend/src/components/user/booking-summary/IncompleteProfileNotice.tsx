import type { FC } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight } from "lucide-react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const isProfileIncomplete = (
  identity: BookingPageState["guestIdentity"],
) =>
  identity.bookingForSelf &&
  (!identity.legalName ||
    !identity.ktpNumber ||
    !identity.ktpAddress ||
    !identity.phone);

export const IncompleteProfileNotice: FC = () => (
  <div className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-900/50 dark:bg-red-900/10">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle size={20} />
      </div>
      <div>
        <h3 className="font-bold text-red-900 dark:text-red-300">
          Lengkapi Data Profil Anda
        </h3>
        <p className="mt-1 text-sm text-red-800 dark:text-red-200/80">
          Data identitas Anda belum lengkap. Lengkapi profil agar data tamu bisa
          terisi otomatis untuk reservasi berikutnya.
        </p>
      </div>
    </div>
    <Link
      to="/profile"
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
    >
      Lengkapi Profil <ChevronRight size={16} className="ml-1" />
    </Link>
  </div>
);
