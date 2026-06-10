import type { FC } from "react";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

type FieldKey = "email" | "ktpAddress" | "ktpNumber" | "legalName" | "name" | "phone";

const fields: { key: FieldKey; label: string; placeholder: string; required?: boolean }[] = [
  { key: "name", label: "Nama Pemesan", placeholder: "Nama yang mudah dihubungi" },
  { key: "legalName", label: "Nama sesuai KTP", placeholder: "Nama legal tamu", required: true },
  { key: "phone", label: "Nomor Telepon", placeholder: "+62 812 xxxx xxxx", required: true },
  { key: "ktpNumber", label: "Nomor KTP", placeholder: "16 digit angka KTP", required: true },
  { key: "email", label: "Email", placeholder: "email@contoh.com" },
  { key: "ktpAddress", label: "Alamat sesuai KTP", placeholder: "Alamat lengkap pada KTP", required: true },
];

export const GuestIdentityForm: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
    <SelfBookingToggle state={state} />
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {fields.map((field) => <GuestIdentityField key={field.key} field={field} state={state} />)}
    </div>
  </div>
);

const SelfBookingToggle: FC<{ state: BookingPageState }> = ({ state }) => (
  <label className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm dark:bg-slate-900">
    <input
      type="checkbox"
      checked={state.guestIdentity.bookingForSelf}
      onChange={(event) => state.setGuestIdentityField("bookingForSelf", event.target.checked)}
      className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
    />
    <span>
      <span className="block font-semibold text-slate-900 dark:text-white">Saya memesan untuk diri sendiri</span>
      <span className="text-slate-500 dark:text-slate-400">Data dari profil akan digunakan. Nonaktifkan jika memesan untuk orang lain.</span>
    </span>
  </label>
);

const GuestIdentityField: FC<{ field: (typeof fields)[number]; state: BookingPageState }> = ({ field, state }) => (
  <label className={field.key.includes("Address") ? "space-y-1.5 md:col-span-2" : "space-y-1.5"}>
    <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {field.label}{field.required ? <span className="text-red-500"> *</span> : null}
    </span>
    <input
      value={state.guestIdentity[field.key]}
      onChange={(event) => state.setGuestIdentityField(field.key, event.target.value)}
      placeholder={field.placeholder}
      disabled={state.guestIdentity.bookingForSelf}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
      inputMode={field.key === "phone" || field.key === "ktpNumber" ? "numeric" : undefined}
      maxLength={field.key === "ktpNumber" ? 16 : undefined}
    />
  </label>
);
