export interface BookingDateResult {
  ciUTC?: string;
  coUTC?: string;
  focusDate?: boolean;
  message?: string;
}

export const formatDateToUTC = (localDateStr: string) => {
  const parts = localDateStr.split("-");
  if (parts.length !== 3) return "";
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

export const hasValidDateRange = (checkIn: string, checkOut: string) =>
  Boolean(checkIn && checkOut && new Date(checkOut) > new Date(checkIn));

export const validateBookingDates = (checkIn: string, checkOut: string): BookingDateResult => {
  if (!checkIn || !checkOut) return { message: "Silakan pilih tanggal check-in dan check-out terlebih dahulu.", focusDate: true };
  const ciUTC = formatDateToUTC(checkIn);
  const coUTC = formatDateToUTC(checkOut);
  if (ciUTC < new Date().toISOString().split("T")[0]) return { message: "Tanggal check-in tidak boleh di masa lalu." };
  if (coUTC <= ciUTC) return { message: "Tanggal check-out harus setelah check-in." };
  return { ciUTC, coUTC };
};

export const focusDatePicker = () => {
  const target = document.getElementById("availability-date-picker-section") || document.getElementById("date-picker-section");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
};
